<script setup>
	const mode = useRouteParams('mode');
	const id = useRouteParams('id');
</script>

<template>
	<Suspense>
		<AppSidebar />
		<template #fallback>
			<AppSidebarSkeleton />
		</template>
	</Suspense>
	<Suspense :timeout="0">
		<AppTimeTable :print="false" :key="mode + id" />
		<template #fallback>
			<AppTimeTableSkeleton />
		</template>
	</Suspense>
</template>
