import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

const root = document.documentElement;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const HEADER_OFFSET = 96;

const initMotion = async (): Promise<void> => {
	gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

	const smoother = ScrollSmoother.create({
		wrapper: '#smooth-wrapper',
		content: '#smooth-content',
		smooth: 1.1,
		effects: true,
		smoothTouch: 0.1,
	});

	// las líneas de los títulos se calculan con las fuentes definitivas
	await document.fonts.ready;
	root.classList.add('motion-ready');

	const ease = 'power3.out';

	// Entrada del hero
	const heroCopy = document.querySelector<HTMLElement>('[data-hero-copy]');
	const heroVisual = document.querySelector<HTMLElement>('[data-hero-visual]');

	if (heroCopy && heroVisual) {
		const title = heroCopy.querySelector<HTMLElement>('[data-split-title]');
		const others = Array.from(heroCopy.children).filter((child) => child !== title);
		const timeline = gsap.timeline({ defaults: { ease, duration: 1.1 } });

		timeline.fromTo(
			heroVisual,
			{ clipPath: 'inset(0 0 0 100%)', opacity: 1 },
			{ clipPath: 'inset(0 0 0 0%)', duration: 1.4, ease: 'power4.inOut' },
		);
		timeline.from(heroVisual.querySelector('img'), { scale: 0.85, rotate: -6, duration: 1.6 }, '<0.35');

		if (title) {
			const split = SplitText.create(title, { type: 'lines' });
			gsap.set(title, { opacity: 1 });
			timeline.from(split.lines, { yPercent: 60, opacity: 0, stagger: 0.12 }, 0.2);
		}

		timeline.fromTo(others, { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1 }, 0.45);
	}

	// Títulos de página: entrada por líneas
	document.querySelectorAll<HTMLElement>('.page-title').forEach((title) => {
		const split = SplitText.create(title, { type: 'lines' });
		gsap.set(title, { opacity: 1 });
		gsap.from(split.lines, {
			yPercent: 60,
			opacity: 0,
			duration: 1.1,
			ease,
			stagger: 0.1,
			delay: 0.1,
			scrollTrigger: { trigger: title, start: 'top 90%', once: true },
		});
	});

	// Bloques que aparecen al hacer scroll
	const revealElements = gsap.utils.toArray<HTMLElement>('.home-reveal, .scroll-reveal');
	gsap.set(revealElements, { y: 48 });
	ScrollTrigger.batch(revealElements, {
		start: 'top 90%',
		once: true,
		onEnter: (batch) =>
			gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, ease, stagger: 0.1, overwrite: true }),
	});

	// Texto que se ilumina palabra a palabra al avanzar el scroll
	document.querySelectorAll<HTMLElement>('[data-scrub-text]').forEach((text) => {
		const split = SplitText.create(text, { type: 'words' });
		gsap.from(split.words, {
			opacity: 0.14,
			stagger: 0.08,
			ease: 'none',
			scrollTrigger: { trigger: text, start: 'top 85%', end: 'bottom 45%', scrub: true },
		});
	});

	// Columnas fijas mientras se recorre su contenido (sustituye a position: sticky)
	const media = gsap.matchMedia();
	media.add('(min-width: 62rem)', () => {
		document.querySelectorAll<HTMLElement>('[data-pin]').forEach((element) => {
			const container = element.parentElement;
			if (!container) {
				return;
			}

			ScrollTrigger.create({
				trigger: element,
				pin: true,
				pinSpacing: false,
				start: `top ${HEADER_OFFSET + 32}px`,
				end: () => `+=${Math.max(0, container.offsetHeight - element.offsetHeight)}`,
				invalidateOnRefresh: true,
			});
		});
	});

	// Enlaces a anclas de la misma página con desplazamiento suave
	const scrollToHash = (hash: string, smooth: boolean): boolean => {
		const target = hash.length > 1 ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
		if (!target) {
			return false;
		}

		smoother.scrollTo(target, smooth, `top ${HEADER_OFFSET}px`);
		return true;
	};

	document.addEventListener('click', (event) => {
		const link = (event.target as Element).closest<HTMLAnchorElement>('a[href*="#"]');
		if (!link || link.pathname !== window.location.pathname || !link.hash) {
			return;
		}

		if (scrollToHash(link.hash, true)) {
			event.preventDefault();
			history.pushState(null, '', link.hash);
		}
	});

	if (window.location.hash) {
		window.setTimeout(() => scrollToHash(window.location.hash, false), 50);
	}

	// Detiene el scroll suave mientras el menú móvil está abierto
	new MutationObserver(() => {
		smoother.paused(document.body.classList.contains('body--menu-open'));
	}).observe(document.body, { attributes: true, attributeFilter: ['class'] });
};

if (!prefersReducedMotion) {
	initMotion().catch(() => root.classList.remove('js-motion'));
}
