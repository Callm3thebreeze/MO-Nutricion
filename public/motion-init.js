// Se carga de forma bloqueante en <head> (fichero externo por la CSP: script-src 'self').
// Oculta los elementos animados antes del primer pintado; si GSAP no llega a cargar, se muestran igualmente.
(() => {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		return;
	}

	const root = document.documentElement;
	root.classList.add('js-motion');

	try {
		// la página anterior marca si la navegación se hizo con transición de vista
		if (sessionStorage.getItem('mo-view-transition')) {
			root.classList.add('vt-arrival');
			sessionStorage.removeItem('mo-view-transition');
		}
	} catch {
		// sin almacenamiento se repite la entrada completa
	}

	window.setTimeout(() => {
		if (!root.classList.contains('motion-ready')) {
			root.classList.remove('js-motion');
		}
	}, 3000);
})();
