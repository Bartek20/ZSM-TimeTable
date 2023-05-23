<script setup>
const mode = ref('')
onMounted(() => {
  document.getElementById('load').classList.add('d-none');
});
</script>

<template>
    <GeneratorNew v-if="mode == 'new'"/>
    <Suspense v-else-if="mode == 'current'">
        <GeneratorCurrent />
        <template #fallback>
            <GeneratorSkeleton />
        </template>
    </Suspense>
    <section v-else id="generator" class="z-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center">
        <div class="row w-50 pb-3">
            <h3 class="text-center">W jaki sposób chcesz edytować plan?</h3>
        </div>
        <div class="row w-50 text-center">
            <div class="col-6" @click="mode = 'new'">
                <i class="pb-2 zsm-generator-new-icon"></i>
                <h5 class="text-nowrap">Nowy plan</h5>
            </div>
            <div class="col-6" @click="mode = 'current'">
                <i class="pb-2 zsm-generator-current-icon"></i>
                <h5 class="text-nowrap">Aktualny plan</h5>
            </div>
        </div>
    </section>
</template>

<style lang="scss">
#generator {
    .row {
        i {
            font-size: 64px;
        }
    }
}
</style>