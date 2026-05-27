const revealElements = Array.from(document.querySelectorAll<HTMLElement>('.home-reveal, .scroll-reveal'));

if (revealElements.length > 0) {
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (prefersReducedMotion || !('IntersectionObserver' in window)) {
		revealElements.forEach((element) => element.classList.add('is-visible'));
	} else {
		document.documentElement.classList.add('home-reveal-ready');
		const pendingElements = new Set(revealElements);
		let animationFrameId = 0;

		const revealElement = (element: Element, currentObserver?: IntersectionObserver): void => {
			element.classList.add('is-visible');
			pendingElements.delete(element as HTMLElement);

			if (currentObserver) {
				currentObserver.unobserve(element);
			}

			if (pendingElements.size === 0) {
				removeFallbackListeners();
			}
		};

		const observer = new IntersectionObserver(
			(entries, currentObserver) => {
				entries.forEach((entry) => {
					const hasReachedRevealPoint = entry.boundingClientRect.top < window.innerHeight * 0.92;

					if (!entry.isIntersecting && !hasReachedRevealPoint) {
						return;
					}

					revealElement(entry.target, currentObserver);
				});
			},
			{
				rootMargin: '0px 0px -8% 0px',
				threshold: 0.14,
			},
		);

		const removeFallbackListeners = (): void => {
			window.removeEventListener('scroll', requestRevealCheck);
			window.removeEventListener('resize', requestRevealCheck);
		};

		const revealReachedElements = (): void => {
			animationFrameId = 0;

			pendingElements.forEach((element) => {
				const hasReachedRevealPoint = element.getBoundingClientRect().top < window.innerHeight * 0.92;

				if (hasReachedRevealPoint) {
					revealElement(element, observer);
				}
			});

			if (pendingElements.size === 0) {
				removeFallbackListeners();
			}
		};

		function requestRevealCheck(): void {
			if (animationFrameId) {
				return;
			}

			animationFrameId = window.requestAnimationFrame(revealReachedElements);
		}

		revealElements.forEach((element) => observer.observe(element));
		window.addEventListener('scroll', requestRevealCheck, { passive: true });
		window.addEventListener('resize', requestRevealCheck);
		requestRevealCheck();
	}
}
