<script setup>
	import appPWA from '@/stores/pwa';
	function closeMenu() {
		document.querySelector('aside.configs')?.classList.remove('open');
		document.querySelector('.overlay')?.classList.remove('overlay--configs');
	}
	const appStatus = computed(() => appPWA.status.value);
</script>

<template>
	<aside class="configs">
		<div class="configs__close" @click="closeMenu">
			<i class="zsm-close-icon"></i>
		</div>
		<MenuSettings />
		<MenuOptions />
		<div class="configs__install">
			<div @click="appPWA.install" v-if="appStatus == 'installable'"><i class="zsm-download-app-icon"></i><b>Zainstaluj Aplikację</b></div>
		</div>
	</aside>
</template>

<style lang="scss">
	.configs {
		display: grid;
		width: $sidebar-width;
		min-height: 100%;
		max-height: 100%;
		padding-top: 0.75rem;
		grid-template-rows: min-content min-content auto;
		gap: 0.5rem;
		background-color: var(--bg-sidebar);
		color: var(--sb-text);
		transition: 0.4s ease-in-out right;
		z-index: 11;
		position: fixed;
		top: 0;
		right: -#{$sidebar-width};
		overflow: auto;

		@include printer {
			display: none;
		}

		&__close {
			position: absolute;
			right: 0;
			top: 0;
			cursor: pointer;
			font-size: 2.3rem;
			width: 48px;
			height: 48px;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		&.open {
			right: 0;
		}

		&__install {
			text-align: center;
			color: white;
			cursor: pointer;
			margin-top: auto;

			div {
				background-color: teal;
				padding: 12px 24px;

				i {
					font-size: 0.9rem;
					padding-right: 0.25rem;
				}
			}
		}
	}
</style>
