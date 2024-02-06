<script setup>
	const props = defineProps({
		links: {
			type: Object,
			required: true,
		},
	});
	function changeMenu(e) {
		var element = e.target
    if (element.tagName != 'LABEL') element = element.parentElement
    element = element.control
    element.checked = !element.checked
	}
</script>

<template>
	<menu>
		<nav>
			<input type="radio" name="menu" id="menuClasses" />
			<div class="menu" v-if="links.classes.length > 0">
				<label @click="changeMenu" for="menuClasses">
					<div>Klasy</div>
				</label>
				<ul>
					<li v-for="item in links.classes">
						<RouterLink :to="{ name: 'plan', params: { mode: 'o', id: item.id } }">
							<span>{{ item.name }}</span>
						</RouterLink>
					</li>
				</ul>
			</div>
			<input type="radio" name="menu" id="menuTeachers" />
			<div class="menu" v-if="links.teachers.length > 0">
				<label for="menuTeachers">
					<div>Nauczyciele</div>
				</label>
				<ul>
					<li v-for="item in links.teachers">
						<RouterLink :to="{ name: 'plan', params: { mode: 'n', id: item.id } }">
							<span>{{ item.name }}</span>
						</RouterLink>
					</li>
				</ul>
			</div>
			<input type="radio" name="menu" id="menuRooms" />
			<div class="menu" v-if="links.rooms.length > 0">
				<label for="menuRooms">
					<div>Sale</div>
				</label>
				<ul>
					<li v-for="item in links.rooms">
						<RouterLink :to="{ name: 'plan', params: { mode: 's', id: item.id } }">
							<span>{{ item.name }}</span>
						</RouterLink>
					</li>
				</ul>
			</div>
		</nav>
	</menu>
</template>

<style lang="scss" scoped>
	.menu {
		display: grid;
		grid-template-rows: auto 0;
		overflow: hidden;
	}
	input[name='menu'] {
		display: none;
		&:checked + .menu {
			grid-template-rows: auto 1fr;
		}
	}
</style>
