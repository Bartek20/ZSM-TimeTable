<script setup>
	const props = defineProps({
		mode: {
			type: String,
			required: true,
		},
		id: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
	});
	const timetableData = useStorage('timetableData', {});
	const title = computed(() => {
		if (props.mode == 'o') {
			if (!('classes' in timetableData.value)) return props.name;
			const reg = props.name.match(/(\d\w+) (\d)([\w ]+)/);
			if (!reg) return props.name;
			const data = {
				class: reg[1],
				specialities: reg[3].split(' '),
			};
			var out = data.class;
			data.specialities.forEach((speciality) => {
				if (timetableData.value.classes[speciality] == undefined) {
					console.warn('Nieznany kierunek:', speciality);
					out = out + ' ' + speciality;
				} else {
					out = out + ' ' + speciality;
				}
			});
			return out;
		} else if (props.mode == 'n') {
			if (!('teachers' in timetableData.value)) return props.name;
			if (timetableData.value.teachers[props.name] == undefined) {
				console.warn('Nieznany nauczyciel:', props.name);
				return props.name;
			}
			const data = timetableData.value.teachers[props.name];
			var out = '';
			switch (props.name) {
				case 'c.Centrum Kształcenia Zawodowego (CK)':
					out = 'CKZ (' + data.code + ')';
					break;
				case 'A.Aeroklub Rzeszowski (AA)':
				case 'E.Emeaero (EE)':
				case 'H.Heli One (HO)':
				case 'L.LineTech (LL)':
				case 'P.Pratt Whitney AeroPower (PT)':
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
		return props.name;
	});
</script>
<template>
	<li class="menu-item">
		<RouterLink class="d-flex align-items-center px-3 text-decoration-none" :to="{ name: 'plan', params: { mode: mode, id: id } }">
			<span class="menu-title">{{ title }}</span>
		</RouterLink>
	</li>
</template>
