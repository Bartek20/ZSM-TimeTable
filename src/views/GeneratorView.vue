<script setup></script>

<template>
  <Suspense>
    <AppGenerator />
    <template #fallback>
      <AppGeneratorSkeleton />
    </template>
  </Suspense>
</template>
