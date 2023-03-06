<script setup>
import { RouterLink, RouterView } from 'vue-router'

</script>

<template>
  <v-app>
		<RouterView />
	</v-app>
</template>

<style>
*, *::before, *::after {
	user-select: none;
	-webkit-user-select: none;
	-webkit-user-drag: none;
}
	body {
  min-width: 100vw;
  min-height: 100vh;
}
.v-application__wrap {
	background-color: red;
}
</style>
