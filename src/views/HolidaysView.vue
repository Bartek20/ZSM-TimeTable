<script setup>
const text = ref();
onMounted(() => {
  document.getElementById("loader-script")?.remove();
  document.getElementById("loader")?.remove();
});
</script>

<template>
  <div class="holidays">
    <img class="holidays__img" src="/assets/images/Wakacje.png" alt="Wakacje" />
    <RouterLink class="holidays__link" :to="{ name: 'home' }"
      >Przejdź do planu</RouterLink
    >
  </div>
</template>

<style lang="scss">
.holidays {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &__img {
    width: min(100%, calc(512px + 2rem));
    object-fit: contain;
    object-position: center;
    aspect-ratio: 1;
    border-radius: 50vw;
    padding: 1rem;
  }

  &__link {
    background-color: #2196f3;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    text-decoration: none;
    font-weight: bold;
    font-size: 1.5rem;
    cursor: pointer;
  }
}
</style>
