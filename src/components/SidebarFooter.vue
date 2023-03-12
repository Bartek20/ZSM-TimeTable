<script setup>
	function getFooter() {
		const date = new Date().getFullYear();
		var result = '2023';
		if (date != '2023') {
			result = result + ' - ' + date;
		}
		return result;
	}
</script>
<template>
	<footer>
		<div class="px-4 py-2 text-center w-100">
			<i class="zsm-copyright-icon"></i>{{ getFooter() }}<br /><strong>Bartłomiej Radoń</strong>
		</div>
	</footer>
</template>

<style lang="scss">
	footer div {
		background-color: teal;
		i {
			padding-right: 5px;
			font-size: 14px;
		}
	}
</style>
