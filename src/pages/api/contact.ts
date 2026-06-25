import type { APIRoute } from "astro";
import { getSecret } from "astro:env/server";

export const prerender = false;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const reasons: Record<string, string> = {
  digestivo: "Síntomas digestivos",
  microbiota: "Microbiota",
  hormonal: "Salud hormonal",
  habitos: "Hábitos y educación nutricional",
};

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

const escapeHtml = (value: string): string =>
  value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character] ?? character,
  );

const readPayload = async (request: Request): Promise<Record<string, unknown>> => {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const payload: unknown = await request.json();
    return typeof payload === "object" && payload !== null
      ? (payload as Record<string, unknown>)
      : {};
  }

  const formData = await request.formData();
  return Object.fromEntries(formData.entries());
};

const asTrimmedString = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

export const POST: APIRoute = async ({ request }) => {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 24_000) {
    return json({ ok: false, message: "La solicitud es demasiado grande." }, 413);
  }

  let payload: Record<string, unknown>;
  try {
    payload = await readPayload(request);
  } catch {
    return json({ ok: false, message: "No se pudo interpretar la solicitud." }, 400);
  }

  const nombre = asTrimmedString(payload.nombre);
  const email = asTrimmedString(payload.email).toLowerCase();
  const motivo = asTrimmedString(payload.motivo);
  const mensaje = asTrimmedString(payload.mensaje);
  const website = asTrimmedString(payload.website);
  const consentimiento =
    payload.consentimiento === true || payload.consentimiento === "on";

  // Honeypot: respondemos como si se hubiera enviado para no dar pistas al bot.
  if (website) {
    return json({ ok: true, message: "Gracias. He recibido tu solicitud." });
  }

  const errors: Record<string, string> = {};
  if (nombre.length < 2 || nombre.length > 100) {
    errors.nombre = "El nombre debe tener entre 2 y 100 caracteres.";
  }
  if (!emailPattern.test(email) || email.length > 254) {
    errors.email = "Introduce un correo electrónico válido.";
  }
  if (!reasons[motivo]) {
    errors.motivo = "Selecciona un motivo de consulta válido.";
  }
  if (mensaje.length < 20 || mensaje.length > 4_000) {
    errors.mensaje = "El mensaje debe tener entre 20 y 4.000 caracteres.";
  }
  if (!consentimiento) {
    errors.consentimiento = "Debes aceptar el consentimiento para continuar.";
  }

  if (Object.keys(errors).length > 0) {
    return json(
      {
        ok: false,
        message: "Revisa los campos indicados antes de enviar.",
        errors,
      },
      422,
    );
  }

  const apiKey = getSecret("RESEND_API_KEY");
  const toEmail = getSecret("CONTACT_TO_EMAIL") ?? "hola@maraolivares.com";
  const fromEmail =
    getSecret("CONTACT_FROM_EMAIL") ??
    "Mara Olivares Nutrició <contacto@maraolivaresnutricio.com>";

  if (!apiKey) {
    console.error("Missing RESEND_API_KEY binding");
    return json(
      {
        ok: false,
        message: "El envío no está disponible temporalmente. Inténtalo más tarde.",
      },
      503,
    );
  }

  const reasonLabel = reasons[motivo];
  const safeName = escapeHtml(nombre);
  const safeEmail = escapeHtml(email);
  const safeReason = escapeHtml(reasonLabel);
  const safeMessage = escapeHtml(mensaje).replace(/\n/g, "<br />");

  let resendResponse: Response;
  try {
    resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "mara-olivares-nutricio/1.0",
        "Idempotency-Key": crypto.randomUUID(),
      },
      signal: AbortSignal.timeout(10_000),
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: `Nueva solicitud web · ${reasonLabel}`,
        html: `
          <h1>Nueva solicitud de contacto</h1>
          <p><strong>Nombre:</strong> ${safeName}</p>
          <p><strong>Correo:</strong> ${safeEmail}</p>
          <p><strong>Motivo:</strong> ${safeReason}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${safeMessage}</p>
        `,
        text: [
          "Nueva solicitud de contacto",
          `Nombre: ${nombre}`,
          `Correo: ${email}`,
          `Motivo: ${reasonLabel}`,
          "",
          mensaje,
        ].join("\n"),
        tags: [{ name: "source", value: "contact_form" }],
      }),
    });
  } catch {
    return json(
      {
        ok: false,
        message: "El servicio de correo no responde. Inténtalo de nuevo en unos minutos.",
      },
      502,
    );
  }

  if (!resendResponse.ok) {
    console.error("Resend request failed", resendResponse.status);
    return json(
      {
        ok: false,
        message: "No se pudo enviar la solicitud. Inténtalo de nuevo en unos minutos.",
      },
      502,
    );
  }

  return json({
    ok: true,
    message: "Gracias. He recibido tu solicitud y te responderé lo antes posible.",
  });
};

export const ALL: APIRoute = () =>
  json({ ok: false, message: "Método no permitido." }, 405);
