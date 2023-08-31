<script setup>
	const mode = useRouteParams('mode');
	const id = useRouteParams('id');
</script>

<template>
	<Suspense :timeout="0">
		<AppTimeTable :print="true" :key="mode + id" />
		<template #fallback>
			<AppTimeTableSkeleton />
		</template>
	</Suspense>
</template>
