import log from '@/functions/logger';

function permute(values) {
	const result = [values.slice().join(' ')];
	const length = values.length;
	const c = new Array(length).fill(0);
	let i = 1;
	let k;
	let p;

	while (i < length) {
		if (c[i] < i) {
			k = i % 2 && c[i];
			p = values[i];
			values[i] = values[k];
			values[k] = p;
			++c[i];
			i = 1;
			result.push(values.slice().join(' '));
			if (result.length >= 100000) {
				log('warn', '[App] Przekroczono limit permutacji (100 000). Zatrzymywanie generowania.');
				break;
			}
		} else {
			c[i] = 0;
			++i;
		}
	}
	return result;
}

function getCombinations(data) {
	const results = [];
	results.push(...permute(data));
	if (data.length > 1) {
		for (let i = 0; i < data.length; i++) {
			results.push(...getCombinations(data.filter((_, index) => !(index === i))));
			if (results.length >= 100000) {
				log('warn', '[App] Przekroczono limit permutacji (100 000). Zatrzymywanie generowania.');
				break;
			}
		}
	}
	return results;
}

export default function getResults(obj) {
	const data = ('map' in obj ? obj : Object.values(obj)).filter((e) => e);
	return [...new Set(getCombinations(data))].sort();
}
