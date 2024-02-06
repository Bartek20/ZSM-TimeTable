<script setup>
	import parseName from '@/functions/parseName';
	import setTitle from '@/functions/setTitle';
	import appData from '@/stores/data';
	import appConfigs from '@/stores/configs';
	function openSidebar() {
		document.querySelector('aside.sidebar')?.classList.add('open');
		document.querySelector('.overlay')?.classList.add('active');
	}
	function openConfigs() {
		document.querySelector('.overlay')?.classList.add('active');
	}
	const title = computed(() => {
		const MODES = {
			o: 'classes',
			n: 'teachers',
			s: 'rooms',
		};
		const mode = appConfigs.value.currentTimeTable.mode;
		const name = appData.value.timetable.title;
		if (!name) {
			switch (appData.value.timetable.status) {
				case 0:
					setTitle('Wczytywanie planu lekcji.');
					return;
				case 404:
					setTitle('Wybrany plan nie został odnaleziony.');
					return;
				case 500:
					setTitle('Wystąpił nieznany błąd.');
					return;
				case 900:
					setTitle('Pobieranie planu nie powiodło się.');
					return;
			}
		}
		var resp = appData.value.parsed[MODES[mode]][name] ?? parseName(mode, name);
		setTitle(resp?.title ?? name);
		return resp?.heading ?? name;
	});
	const headEl = ref(null);
	const { width: headElSize } = useElementSize(headEl);
	const titleEl = ref(null);
	const { width: titleElSize } = useElementSize(titleEl);
	const marquee = computed(() => {
		if (!headElSize.value) return false;
		if (!titleElSize.value) return false;
		if (titleElSize.value > headElSize.value) return true;
		return false;
	});
</script>

<template>
	<div class="head">
		<div class="btn-list" @click="openSidebar">
			<div>
				<i class="zsm-menu-icon"></i>
			</div>
		</div>
		<div ref="headEl" class="title" :class="{ noscroll: !marquee }">
			<h3 ref="titleEl" :class="{ marquee: marquee }">{{ title }}</h3>
			<h3 v-show="marquee" :class="{ marquee: marquee }">{{ title }}</h3>
		</div>
		<div class="btn-config">
			<div class="btn-info" @click="openConfigs">
				<i class="d-block zsm-info-icon"></i>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	$icon: 48px;
	.head {
		--padding: 1rem;
		display: grid;
		grid-template-columns: 1fr $icon;
		@include tablet {
			grid-template-columns: $icon 1fr $icon;
		}
		@include printer {
			grid-template-columns: 1fr;
		}
		gap: var(--padding);
		color: var(--tt-text);
		.btn-list,
		.btn-config {
			display: flex;
			cursor: pointer;
			@include printer {
				display: none;
			}
			align-items: center;
			justify-content: center;
		}
		.btn-list {
			display: none;
			@include tablet {
				display: flex;
			}
		}
		i {
			font-size: 2.3rem;
		}
		.title {
			font-size: 1.5rem;
			display: flex;
			align-items: center;
			overflow: hidden;
			gap: 5rem;
			margin-left: var(--padding);
			@include tablet {
				margin-left: 0;
			}
			@include printer {
				margin-left: 0;
			}
			h3 {
				margin: 0;
				white-space: nowrap;
			}
			.marquee {
				animation: marquee 10s linear infinite;
			}
			&.noscroll {
				justify-content: center;
			}
		}
	}
</style>
