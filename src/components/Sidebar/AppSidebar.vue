<script setup>
	import appConfigs from '@/stores/configs';
	import appData from '@/stores/data';
	function getFooter() {
		const date = new Date().getFullYear();
		return date == '2023' ? '2023' : `2023 - ${date}`;
	}
	const dates = computed(() => {
		const obj = appData.value.timetable;
		if (!obj || obj.status == 0 || obj.gen_date == undefined || obj.apply_date == undefined) return undefined;
		return {
			gen: obj.gen_date,
			apply: obj.apply_date,
		};
	});
	function closeMenu() {
		document.querySelector('aside.sidebar')?.classList.remove('open');
		document.querySelector('.overlay')?.classList.remove('activeSidebar');
	}
</script>

<template>
	<aside class="sidebar">
		<div class="closeBtn" @click="closeMenu"><i class="zsm-close-icon"></i></div>
		<header>
			<a :href="appConfigs.school.homeURL" target="_blank" rel="noopener noreferrer">
				<img class="p-4" src="/assets/images/logo.png" :alt="appConfigs.school.logoDescription || 'Logo Szkoły'" />
			</a>
		</header>
		<Suspense>
			<SidebarNavigation />
			<template #fallback>
				<div></div>
			</template>
		</Suspense>
		<footer>
			<div class="dates" v-if="dates">
				<p><b>Wygenerowano: </b>{{ dates.gen }}</p>
				<p><b>Obowiązuje od: </b>{{ dates.apply }}</p>
			</div>
			<div class="copyright">
				<p><i class="zsm-copyright-icon"></i>{{ getFooter() }}</p>
				<p><strong>Bartłomiej Radoń</strong></p>
			</div>
		</footer>
	</aside>
</template>

<style lang="scss" scoped>
	aside {
		display: grid;
		width: $sidebar-width;
		min-height: 100%;
		max-height: 100%;
		grid-template-rows: auto 1fr auto;
		gap: 0.25rem;
		background-color: var(--bg-sidebar);
		color: var(--sb-text);
		transition: 0.4s ease-in-out left;
		.closeBtn {
			position: absolute;
			left: 0;
			top: 0;
			display: none;
			cursor: pointer;
			font-size: 2.3rem;
			width: 48px;
			height: 48px;
			justify-content: center;
			align-items: center;
			@include tablet {
				display: flex;
			}
		}
		header {
			text-align: center;
			img {
				padding: 6px 24px 0;
				width: 175px;
			}
		}
		footer {
			text-align: center;
			color: white;
			div {
				&.dates {
					background-color: darkslategray;
					p {
						display: grid;
						grid-template-columns: auto auto;
						justify-content: space-between;
						&:first-child {
							margin-bottom: 3px;
						}
					}
				}
				&.copyright {
					background-color: teal;
					i {
						font-size: 0.9rem;
						padding-right: 0.25rem;
					}
				}
				padding: 12px 24px;
			}
		}
	}
	@include tablet {
		aside {
			z-index: 11;
			position: fixed;
			top: 0;
			left: -#{$sidebar-width};
			&.open {
				left: 0;
			}
		}
	}
	@include printer {
		aside {
			display: none;
		}
	}
</style>
