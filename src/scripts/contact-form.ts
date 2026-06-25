const forms = document.querySelectorAll<HTMLFormElement>('[data-contact-form]');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactResponse {
ok?: boolean;
message?: string;
errors?: Record<string, string>;
}

const setStatusMessage = (
status: HTMLElement | null,
message: string,
options: { isError: boolean },
): void => {
if (!status) {
return;
}

status.textContent = message;
status.setAttribute('role', options.isError ? 'alert' : 'status');
status.setAttribute('aria-live', options.isError ? 'assertive' : 'polite');
};

const setFieldError = (field: HTMLElement, message: string): void => {
const errorNode = field
.closest('form')
?.querySelector<HTMLElement>(`[data-error-for="${field.getAttribute('name')}"]`);

if (errorNode) {
errorNode.textContent = message;
}

if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
field.setAttribute('aria-invalid', message ? 'true' : 'false');
}
};

const clearErrors = (form: HTMLFormElement): void => {
const fields = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
'input, textarea, select',
);

fields.forEach((field) => setFieldError(field, ''));
};

forms.forEach((form) => {
const status = form.querySelector<HTMLElement>('[data-form-status]');

const fields = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
'input, textarea, select',
);

fields.forEach((field) => {
const eventName = field instanceof HTMLInputElement && field.type === 'checkbox' ? 'change' : 'input';
field.addEventListener(eventName, () => {
setFieldError(field, '');
setStatusMessage(status, '', { isError: false });
});
});

form.addEventListener('submit', async (event) => {
event.preventDefault();
clearErrors(form);
setStatusMessage(status, '', { isError: false });

const formData = new FormData(form);
const nombre = (formData.get('nombre') ?? '').toString().trim();
const email = (formData.get('email') ?? '').toString().trim();
const motivo = (formData.get('motivo') ?? '').toString().trim();
const mensaje = (formData.get('mensaje') ?? '').toString().trim();
const consentimiento = formData.get('consentimiento') === 'on';

let firstInvalidField: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null = null;

const nombreField = form.querySelector<HTMLInputElement>('[name="nombre"]');
if (nombre.length < 2 && nombreField) {
setFieldError(nombreField, 'El nombre debe tener al menos 2 caracteres.');
if (!firstInvalidField) {
firstInvalidField = nombreField;
}
}

const emailField = form.querySelector<HTMLInputElement>('[name="email"]');
if (!emailPattern.test(email) && emailField) {
setFieldError(emailField, 'Introduce un correo electrónico válido.');
if (!firstInvalidField) {
firstInvalidField = emailField;
}
}

const motivoField = form.querySelector<HTMLSelectElement>('[name="motivo"]');
if (!motivo && motivoField) {
setFieldError(motivoField, 'Selecciona un motivo de consulta.');
if (!firstInvalidField) {
firstInvalidField = motivoField;
}
}

const mensajeField = form.querySelector<HTMLTextAreaElement>('[name="mensaje"]');
if (mensaje.length < 20 && mensajeField) {
setFieldError(mensajeField, 'El mensaje debe incluir al menos 20 caracteres.');
if (!firstInvalidField) {
firstInvalidField = mensajeField;
}
}

const consentimientoField = form.querySelector<HTMLInputElement>('[name="consentimiento"]');
if (!consentimiento && consentimientoField) {
setFieldError(consentimientoField, 'Debes aceptar el consentimiento para continuar.');
if (!firstInvalidField) {
firstInvalidField = consentimientoField;
}
}

if (firstInvalidField) {
setStatusMessage(status, 'Revisa los errores del formulario antes de continuar.', { isError: true });
firstInvalidField.focus();
return;
}

const submitButton = form.querySelector<HTMLButtonElement>('[data-submit-button]');
const originalButtonText = submitButton?.textContent ?? 'Enviar solicitud';

if (submitButton) {
submitButton.disabled = true;
submitButton.setAttribute('aria-disabled', 'true');
submitButton.textContent = 'Enviando…';
}

setStatusMessage(status, 'Enviando tu solicitud…', { isError: false });

try {
const response = await fetch(form.action, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
nombre,
email,
motivo,
mensaje,
consentimiento,
website: (formData.get('website') ?? '').toString(),
}),
});

const result = (await response.json()) as ContactResponse;

if (!response.ok || !result.ok) {
if (result.errors) {
Object.entries(result.errors).forEach(([fieldName, message]) => {
const field = form.elements.namedItem(fieldName);
if (field instanceof HTMLElement) {
setFieldError(field, message);
}
});

const firstServerError = Object.keys(result.errors)[0];
const field = firstServerError
? form.elements.namedItem(firstServerError)
: null;
if (field instanceof HTMLElement) {
field.focus();
}
}

setStatusMessage(
status,
result.message ?? 'No se pudo enviar la solicitud. Inténtalo de nuevo.',
{ isError: true },
);
return;
}

form.reset();
setStatusMessage(
status,
result.message ?? 'Gracias. He recibido tu solicitud.',
{ isError: false },
);
} catch {
setStatusMessage(
status,
'No se pudo conectar con el servicio de envío. Comprueba tu conexión e inténtalo de nuevo.',
{ isError: true },
);
} finally {
if (submitButton) {
submitButton.disabled = false;
submitButton.removeAttribute('aria-disabled');
submitButton.textContent = originalButtonText;
}
}
});
});
