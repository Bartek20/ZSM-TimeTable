<script setup>
	import appConfigs from '@/stores/configs';
	import appData from '@/stores/data';
	function printTimeTable() {
		// Open printed page
		const page = window.open(
			`${appConfigs.value.school.timetableURL}plany/${appConfigs.value.currentTimeTable.mode}${appConfigs.value.currentTimeTable.id}.html`,
			'_print'
		);
		if (!page) return;
		// Hide unnecessary items and open print dialog
		page.onload = () => {
			// Template
			const template = '<tr><td align="left">{gen}</td><td align="right">{apply}</td></tr>';
			// Variables
			const genDateValue = /(.*)<br>/
				.exec(
					page.document.querySelector('body > div:nth-child(2) > table > tbody > tr:nth-child(3) > td.op > table > tbody > tr > td:nth-child(1)').innerHTML
				)[1]
				.trim();
			const genDate = genDateValue.charAt(0).toUpperCase() + genDateValue.slice(1);
			const appDate = page.document.querySelector('body > div:nth-child(2) > table > tbody > tr:nth-child(2) > td').innerHTML.trim();
			// Hide unnecessary parts
			page.document.querySelector('body > div:nth-child(2) > table > tbody > tr:nth-child(3)').style.display = 'none';
			page.document.querySelector('body > div:nth-child(2) > table > tbody > tr:nth-child(4)').style.display = 'none';
			// Change footer
			page.document.querySelector('body > div:nth-child(2) > table > tbody > tr:nth-child(2)').innerHTML = template
				.replace('{gen}', genDate)
				.replace('{apply}', appDate);

			// Print page
			page.print();
		};
		// Close page after print
		page.onafterprint = () => {
			page.close();
		};
	}
</script>

<template>
	<div class="options" v-if="appData.timetable.status == 200">
		<span><b>Opcje</b></span>
		<a
			class="option"
			:href="`${appConfigs.school.timetableURL}plany/${appConfigs.currentTimeTable.mode}${appConfigs.currentTimeTable.id}.html`"
			target="_blank">
			<i class="zsm-old-timetable-icon"></i>
			<span>Otwórz oryginalny plan</span>
		</a>
		<div class="option" @click="printTimeTable">
			<i class="zsm-print-timetable-icon"></i>
			<span>Wydrukuj plan</span>
		</div>
	</div>
	<div v-else></div>
</template>

<style lang="scss" scoped>
	.options {
		margin-inline: 0.75rem;
		> span {
			font-size: 1.1rem;
			+ * {
				margin-top: 0.25rem;
			}
		}
		> *:not(span):not(:last-child) {
			margin-bottom: 0.25rem;
		}
		.option {
			padding: 0.25rem 0.75rem 0.25rem 0;
			text-decoration: none;
			color: var(--sb-text);
			height: 50px;
			display: flex;
			align-items: center;
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
			&:hover {
				background-color: var(--bg-sidebar-hover);
				color: var(--tt-text);
				border-radius: 6px;
			}
		}
	}
</style>
