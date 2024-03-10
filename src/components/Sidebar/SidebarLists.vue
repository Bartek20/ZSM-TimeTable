<script setup>
	import { useElementScrollbarSize } from '@/functions/useScrollbarSize';
	const props = defineProps({
		links: {
			type: Object,
			required: true,
		},
		query: {
			type: String,
			required: true,
		},
	});
	const navBar = ref();
	const { width } = useElementScrollbarSize(navBar);
	const listPaddings = computed(() => {
		if (width.value > 12)
			return {
				marginRight: '0',
				padding: '0',
			};
		if (width.value > 10)
			return {
				marginRight: '0',
				padding: `calc(0.75rem - ${width.value}px)`,
			};
		return {
			marginRight: '2px',
			padding: `calc(0.75rem - 2px - ${width.value}px)`,
		};
	});
</script>

<template>
	<menu class="sidebar__navigation">
		<nav class="sidebar__navigation__nav" ref="navBar">
			<SidebarList id="menuClasses" icon="zsm-student-icon" name="Klasy" mode="o" :list="links.classes" />
			<SidebarList id="menuTeachers" icon="zsm-teacher-icon" name="Nauczyciele" mode="n" :list="links.teachers" />
			<SidebarList id="menuRooms" icon="zsm-room-icon" name="Sale" mode="s" :list="links.rooms" />
			<div class="empty" v-if="query.length > 0 && links.classes.length == 0 && links.teachers.length == 0 && links.rooms.length == 0">
				<span>Brak wyników dla:</span>
				<br />
				"<b> {{ query }} </b>"
			</div>
		</nav>
	</menu>
</template>

<style lang="scss">
	.sidebar__navigation {
		&:not(:hover) &__nav {
			--scrollbar: transparent;
			--bg-scrollbar: transparent;
		}
		&__nav {
			overflow-x: auto;
			height: 100%;
			scrollbar-gutter: stable;
			margin-left: 0.75rem;
			margin-right: v-bind('listPaddings.marginRight');
			padding-right: v-bind('listPaddings.padding');
			&::-webkit-scrollbar {
				width: 0.5rem;
			}
			&::-webkit-scrollbar-thumb {
				border: 0.1em solid var(--bg-scrollbar);
			}
		}
	}
</style>
