<script setup>
	import log from '@/functions/logger';
	import {useToast} from 'vue-toastification';
	const toast = useToast();
	// Prevent print screen using shortcut
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			document.querySelector('aside.sidebar')?.classList.remove('open');
			document.querySelector('aside.configs')?.classList.remove('open');
			document.querySelector('.overlay')?.classList.remove('overlay--sidebar');
			document.querySelector('.overlay')?.classList.remove('overlay--configs');
		}
		if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
			e.preventDefault();
			e.stopImmediatePropagation();
			log('warn', '[App] Próba drukowania planu skrótem została zablokowana.');
			toast.warning('Aby wydrukować plan lekcji skorzystaj z opcji w menu.');
		}
	});
</script>

<template>
	<Suspense>
		<RouterView />
	</Suspense>
</template>

<style lang="scss">
	#app {
		display: grid;
		grid-template-columns: $sidebar-width 1fr;
		@include tablet {
			grid-template-columns: 1fr;
		}
		@include printer {
			grid-template-columns: 1fr;
		}
	}
</style>
