<script setup>
	import appData from '@/stores/data';
	import schoolData from '../../../public/schoolData';
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
</script>

<template>
	<aside class="sidebar">
		<header>
			<a :href="schoolData.schoolHomeURL" target="_blank" rel="noopener noreferrer">
				<img class="p-4" src="/assets/images/logo.png" :alt="schoolData.schoolLogoDescription || 'Logo Szkoły'" />
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
