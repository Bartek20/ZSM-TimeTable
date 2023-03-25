<script setup>
	import { useRouter } from 'vue-router';
	import { TEACHERS } from '../functions/constants';
	const router = useRouter();

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
	function setPlan(mode, id) {
		if (id == undefined) return;
		document.cookie = `selectedTimeTable=${mode + id}; expires=Tue, 19 Jan 2038 04:14:07 GMT; path=/`;
		router.push({ name: 'plan', params: { mode: mode, id: id } });
	}
	function titleParser(title) {
		if (TEACHERS[title] == undefined) return title;
		const data = TEACHERS[title];
		var out = '';
		switch (title) {
			case 'A.Aeroklub Rzeszowski (AA)':
				out = data.name + ' (' + data.code + ')';
				break;
			case 'c.Centrum Kształcenia Zawodowego (CK)':
				out = 'CKZ (' + data.code + ')';
				break;
			case 'E.Emeaero (EE)':
				out = data.name + ' (' + data.code + ')';
				break;
			case 'H.Heli One (HO)':
				out = data.name + ' (' + data.code + ')';
				break;
			case 'L.LineTech (LL)':
				out = data.name + ' (' + data.code + ')';
				break;
			case 'P.Pratt Whitney AeroPower (PT)':
				out = data.name + ' (' + data.code + ')';
				break;
			case 'S.Salony fryzjerskie (FR)':
				out = data.name + ' (' + data.code + ')';
				break;
			default:
				out = data.name.charAt(0) + '. ';
				if (data.surname) out = out + data.surname + ' ';
				out = out + '(' + data.code + ')';
				break;
		}
		return out;
	}
</script>

<template>
	<li class="menu-item sub-menu">
		<a href="#">
			<span class="menu-icon">
				<i :class="symbol"></i>
			</span>
			<span class="menu-title">{{ name }}</span>
		</a>
		<div class="sub-menu-list">
			<ul>
				<li v-for="el in list" class="menu-item" @click="setPlan(id, el.value)">
					<a href="#">
						<span class="menu-title">{{ titleParser(el.name) }}</span>
					</a>
				</li>
			</ul>
		</div>
	</li>
</template>

<style lang="scss">
	$text-color: #7d84ab;
	$secondary-text-color: #dee2ec;
	$bg-color: #0c1e35;
	$secondary-bg-color: #0b1a2c;
	@keyframes swing {
		0%,
		30%,
		50%,
		70%,
		100% {
			transform: rotate(0deg);
		}

		10% {
			transform: rotate(10deg);
		}

		40% {
			transform: rotate(-10deg);
		}

		60% {
			transform: rotate(5deg);
		}

		80% {
			transform: rotate(-5deg);
		}
	}
	.menu {
		> ul > .menu-item.sub-menu > .sub-menu-list {
			visibility: visible !important;
			position: static !important;
			transform: translate(0, 0) !important;
		}
		ul {
			list-style-type: none;
			padding: 0;
			margin: 0;
		}
		.menu-header {
			font-weight: 600;
			padding: 10px 25px;
			font-size: 0.8em;
			letter-spacing: 2px;
			transition: opacity 0.3s;
			opacity: 0.5;
		}
		.menu-item {
			a {
				display: flex;
				align-items: center;
				height: 50px;
				padding: 0 20px;
				color: $text-color;

				.menu-icon {
					font-size: 1.2rem;
					width: 35px;
					min-width: 35px;
					height: 35px;
					line-height: 35px;
					text-align: center;
					display: inline-block;
					margin-right: 10px;
					border-radius: 2px;
					transition: color 0.3s;
					i {
						display: inline-block;
					}
				}

				.menu-title {
					font-size: 0.9em;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					flex-grow: 1;
					transition: color 0.3s;
				}
				.menu-prefix,
				.menu-suffix {
					display: inline-block;
					padding: 5px;
					opacity: 1;
					transition: opacity 0.3s;
				}
				&:hover {
					.menu-title {
						color: $secondary-text-color;
					}
					.menu-icon {
						color: $secondary-text-color;
						i {
							animation: swing ease-in-out 0.5s 1 alternate;
						}
					}
					&::after {
						border-color: $secondary-text-color !important;
					}
				}
			}

			&.sub-menu {
				position: relative;
				> a {
					&::after {
						content: '';
						transition: transform 0.3s;
						border-right: 2px solid currentcolor;
						border-bottom: 2px solid currentcolor;
						width: 5px;
						height: 5px;
						transform: rotate(-45deg);
					}
				}

				> .sub-menu-list {
					padding-left: 20px;
					display: none;
					overflow: hidden;
					z-index: 999;
				}
				&.open {
					> a {
						color: $secondary-text-color;
						&::after {
							transform: rotate(45deg);
						}
					}
				}
			}

			&.active {
				> a {
					.menu-title {
						color: $secondary-text-color;
					}
					&::after {
						border-color: $secondary-text-color;
					}
					.menu-icon {
						color: $secondary-text-color;
					}
				}
			}
		}
		> ul > .sub-menu.open {
			background-color: rgba($secondary-bg-color, 0.5);
		}

		&.icon-shape-circle,
		&.icon-shape-rounded,
		&.icon-shape-square {
			.menu-item a .menu-icon {
				background-color: $secondary-bg-color;
			}
		}

		&.icon-shape-circle .menu-item a .menu-icon {
			border-radius: 50%;
		}
		&.icon-shape-rounded .menu-item a .menu-icon {
			border-radius: 4px;
		}
		&.icon-shape-square .menu-item a .menu-icon {
			border-radius: 0;
		}
		a {
			text-decoration: none;
		}
	}
</style>
