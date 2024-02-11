<script setup>
	const PWAStore = usePWAStore();
	const appStatus = computed(() => PWAStore.status());
</script>

<template>
	<aside class="configs">
		<MenuSettings />
		<MenuOptions />
		<div class="install">
			<div @click="PWAStore.install" v-if="appStatus == 'installable'"><i class="zsm-download-app-icon"></i><b>Zainstaluj Aplikację</b></div>
		</div>
	</aside>
</template>

<style lang="scss" scoped>
	aside {
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
		&.open {
			right: 0;
		}
		.install {
			text-align: center;
			color: white;
			cursor: pointer;
			margin-top: auto;
			div {
				background-color: teal;
				i {
					font-size: 0.9rem;
					padding-right: 0.25rem;
				}
				padding: 12px 24px;
			}
		}
	}
	@include printer {
		aside {
			display: none;
		}
	}
</style>
