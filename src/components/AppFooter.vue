<script setup>
	function getFooter() {
		const date = new Date().getFullYear()
		var result = '2023'
		if (date != '2023') {
			result = result + ' - ' + date
		}
		return result
	}
</script>
<template>
	<v-footer class="">
    <div class="px-4 py-2 bg-teal text-center w-100">
      &copy; {{ getFooter() }}<br /><strong>Bartłomiej Radoń</strong>
    </div>
  </v-footer>
</template>

<style>
	footer {
		height: min-content;
	}
	footer div {
		margin-top: auto;
	}
</style>