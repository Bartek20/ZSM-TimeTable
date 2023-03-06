<script setup>
	import AppFooter from '@/components/AppFooter.vue';
	import { usePlansStore } from '@/stores/plans';
	import { useTimeStore } from '@/stores/time';
	const plansStore = usePlansStore();
	const timeStore = useTimeStore();
	plansStore.getTimeTable();
	timeStore.getTime();
	function test(e) {
		const ob = e.target.control;
		ob.checked = !ob.checked;
		e.target.parentElement.scrollTo(0, 0);
	}
</script>

<template>
	<section id="sidebar">
		<header class="logo">
			<img src="src/assets/logo-zsm.png" />
		</header>
		<nav class="list">
			<input id="o" type="radio" name="label" value="Klasy" />
			<label @click.prevent="test($event)" for="o">Klasy<v-icon class="arrow" icon="mdi-vuetify" /></label>
			<ul data-list="o">
				<li v-for="o in plansStore.lists.classes">{{ o.name }}</li>
			</ul>
			<input id="n" type="radio" name="label" value="Nauczyciele" />
			<label @click.prevent="test($event)" for="n">Nauczyciele<v-icon class="arrow" icon="mdi-vuetify" /></label>
			<ul data-list="n">
				<li v-for="n in plansStore.lists.teachers">{{ n.name }}</li>
			</ul>
			<input id="s" type="radio" name="label" value="Sale" />
			<label @click.prevent="test($event)" for="s">Sale<v-icon class="arrow" icon="mdi-vuetify" /></label>
			<ul data-list="s">
				<li v-for="s in plansStore.lists.rooms">{{ s.name }}</li>
			</ul>
		</nav>
		<AppFooter />
	</section>
</template>

<style lang="scss">
	#sidebar {
		background-color: white;
		max-width: 250px;
		height: 100vh;
		display: flex;
		flex-direction: column;
		color: white;
		.logo {
			flex-shrink: 0;
			height: 200px;
			img {
				display: block;
				margin: auto;
				padding: 25px;
			}
		}
		.list {
			flex-grow: 1;
			overflow: auto;
			&::-webkit-scrollbar {
				display: none;
			}
			input[type='radio'] {
				display: none;
			}
			label {
				display: flex;
				background-color: blue;
				padding: 10px;
				border-radius: 10px;
				margin-inline: 10px;
				margin-block: 5px;
				width: calc(100% - 20px);
				i.arrow {
					margin-left: auto;
					transition: 0.25s ease-in-out;
				}
			}
			ul {
				height: 0;
				transition: 2.5s ease-in-out;
				overflow: hidden;
				margin-inline: 10px;
				background-color: blue;
				border-radius: 10px;
				li {
					padding: 5px;
				}
			}
			input:checked + label + ul {
				padding: 10px;
				margin-block: 5px 10px;
				height: auto;
				overflow: auto;
			}
			input:checked + label i.arrow {
				transform: rotate(180deg);
			}
		}
	}
</style>
