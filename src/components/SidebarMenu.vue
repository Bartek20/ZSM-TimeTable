<script setup>
	import { usePlansStore } from '@/stores/plans';
	import { useRouter } from 'vue-router';
	const router = useRouter();

	const plansStore = usePlansStore();
	const props = defineProps({
		id: {
			type: String,
			required: true,
		},
		symbol: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		list: {
			type: Array,
			required: true,
		},
	});
	function selectSubmenu(e) {
		var ob = e.target;
		if (ob.localName == 'i') ob = ob.parentElement;
		ob = ob.control;
		ob.checked = !ob.checked;
		ob.parentElement.scrollTo({ top: 0, behavior: 'smooth' });
	}
	function setPlan(mode, id) {
		if (id == undefined) return;
		document.cookie = `selectedTimeTable=${mode + id}; expires=Tue, 19 Jan 2038 04:14:07 GMT; path=/`;
		router.push({ name: 'plan', params: { mode: mode, id: id } });
	}
</script>

<template>
	<input :id="id" type="radio" name="label" :value="name" />
	<label @click.prevent="selectSubmenu($event)" :for="id"><i class="icon" :class="symbol"></i>{{ name }}<i class="arrow zsm-chevron-icon"></i></label>
	<ul data-list="o">
		<li @click="setPlan(id, el.value)" v-for="el in list">{{ el.name }}</li>
	</ul>
</template>

<style lang="scss">
	#sidebar nav {
		input[type='radio'] {
			display: none;
		}
		label {
			width: calc(100% - 12px);
			padding-inline: 12px;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: #7101ff;
			padding: 10px;
			border-radius: 10px;
			margin-inline: 0;
			margin-bottom: 10px;
			font-family: 'Roboto', 'Arial', sans-serif;
			font-weight: 400;
			line-height: 24px;
			font-size: 16px;
			i {
				font-size: 20px;
			}
			i.icon {
				width: 24px;
				margin-right: 24px;
				text-align: center;
			}
			i.arrow {
				margin-left: auto;
				transition: 0.25s ease-in-out;
			}
		}
		ul {
			max-height: 0;
			transition: 0.75s ease-in-out max-height, 0.75s ease-in padding;
			overflow: hidden;
			background-color: #7101ff;
			border-radius: 10px;
			padding-inline: 10px;
			margin-block: 0;
			&::-webkit-scrollbar {
				display: none;
			}
			li {
				padding: 5px;
			}
			&:last-of-type {
				margin-bottom: 0 !important;
			}
		}
		input:checked + label {
			+ ul {
				transition: 0.75s ease-in-out max-height, 0ms ease padding;
				margin-bottom: 10px;
				padding: 10px;
				max-height: 1000vh;
				overflow: auto;
			}
			i.arrow {
				transform: rotate(180deg);
			}
		}
	}
</style>
