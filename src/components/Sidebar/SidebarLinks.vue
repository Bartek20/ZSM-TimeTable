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
			<input type="radio" name="menu" id="menuClasses" />
			<div class="menu" v-if="links.classes.length > 0">
				<label @click="changeMenu" for="menuClasses">
					<i class="zsm-student-icon"></i>
					<span>Klasy</span>
					<i class="zsm-arrow-icon"></i>
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
				<label @click="changeMenu" for="menuTeachers">
					<i class="zsm-teacher-icon"></i>
					<span>Nauczyciele</span>
					<i class="zsm-arrow-icon"></i>
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
				<label @click="changeMenu" for="menuRooms">
					<i class="zsm-room-icon"></i>
					<span>Sale</span>
					<i class="zsm-arrow-icon"></i>
				</label>
				<ul>
					<li v-for="item in links.rooms">
						<RouterLink :to="{ name: 'plan', params: { mode: 's', id: item.id } }">
							<span>{{ item.name }}</span>
						</RouterLink>
					</li>
				</ul>
			</div>
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
			&::-webkit-scrollbar-track,
			&::-webkit-scrollbar-thumb {
				border: 0;
				background-color: transparent;
			}
			@supports (scrollbar-color: red red) {
				scrollbar-color: transparent transparent;
			}
		}
		nav {
			overflow: hidden auto;
			height: 100%;
			scrollbar-gutter: stable;
			margin-left: 0.75rem;
			margin-right: 3px;
			padding-right: 3px;
		}
	}
	.menu {
		display: grid;
		grid-template-rows: 50px 0;
		overflow: hidden;
		label {
			display: flex;
			align-items: center;
			height: 50px;
			cursor: pointer;
			i {
				display: block;
				font-size: 20px;
				min-width: 40px;
				text-align: center;
			}
			span {
				width: 100%;
			}
			i:last-of-type {
				transition: rotate 0.3s ease-in-out;
			}
		}
		ul li {
			&:not(:last-of-type) {
				margin-bottom: .125rem;
			}
			a {
				height: 50px;
				padding-left: 0.5rem;
				display: flex;
				align-items: center;
				width: 100%;
				text-decoration: none;
				color: var(--sb-text);
				&.router-link-active,
				&:hover {
					background-color: var(--bg-sidebar-hover);
					color: var(--tt-text);
					border-radius: 6px;
				}
			}
		}
	}
	input[name='menu'] {
		display: none;
		&:checked + .menu {
			grid-template-rows: 50px 1fr;
			label i:last-of-type {
				rotate: 90deg;
			}
		}
	}
</style>
