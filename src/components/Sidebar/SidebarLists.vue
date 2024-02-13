<script setup>
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
	function changeMenu(e) {
		e.preventDefault();
		let element = e.target;
		if (element.tagName != 'LABEL') element = element.parentElement;
		if (element.tagName != 'LABEL') element = element.parentElement;
		element = element.control;
		element.checked = !element.checked;
	}
</script>

<template>
	<menu>
		<nav>
			<SidebarList id="menuClasses" icon="zsm-student-icon" name="Klasy" :list="links.classes" />
			<SidebarList id="menuTeachers" icon="zsm-teacher-icon" name="Nauczyciele" :list="links.teachers" />
			<SidebarList id="menuRooms" icon="zsm-room-icon" name="Sale" :list="links.rooms" />
			<div class="empty" v-if="links.classes.length == 0 && links.teachers.length == 0 && links.rooms.length == 0">
				<span>Brak wyników dla:</span>
				<br />
				"<b>{{ query }}</b
				>"
			</div>
		</nav>
	</menu>
</template>

<style lang="scss" scoped>
	menu {
		nav {
			&::-webkit-scrollbar {
				width: 0.5rem;
			}
			&::-webkit-scrollbar-thumb {
				border: 0.1em solid var(--bg-scrollbar);
			}
		}
		&:not(:hover) nav {
			@supports (scrollbar-color: red red) {
				scrollbar-color: transparent transparent;
			}
			&::-webkit-scrollbar-track,
			&::-webkit-scrollbar-thumb {
				border: 0;
				background-color: transparent;
			}
		}
		nav {
			overflow-x: auto;
			height: 100%;
			scrollbar-gutter: stable;
			margin-left: 0.75rem;
			margin-right: 3px;
			padding-right: 3px;
		}
	}
</style>
