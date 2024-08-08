<script setup>
import appConfigs from "@/stores/configs";
import { addHistory } from "@/functions/recentHistory";
onMounted(() => {
  document.getElementById("loader-script")?.remove();
  document.getElementById("loader")?.remove();
});
const route = useRoute();
const user = computed(() => {
  if (route.redirectedFrom?.params?.user) {
    appConfigs.value.app.isTeacher =
      route.redirectedFrom.params.user === "nauczyciel";
    addHistory(
      route.redirectedFrom.params.mode,
      route.redirectedFrom.params.id,
    );
  }
  return (
    route.redirectedFrom?.params?.user ??
    (appConfigs.value.app.isTeacher ? "nauczyciel" : "uczen")
  );
});
</script>

<template>
  <div class="holidays">
    <img class="holidays__img" src="/assets/images/Wakacje.png" alt="Wakacje" />
    <RouterLink
      class="holidays__link"
      :to="{ name: 'home', params: { user: user } }"
      >Przejdź do planu</RouterLink
    >
  </div>
</template>

<style lang="scss">
$padding: 1rem;

.holidays {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-height: 100%;
  min-height: 100%;
  height: 100%;

  &__img {
    max-width: min(100%, calc(512px + 2 * $padding));
    max-height: min(calc(100% - 48px - $padding), calc(512px + 2 * $padding));
    object-fit: contain;
    object-position: center;
    aspect-ratio: 1;
    border-radius: 50vw;
    padding: $padding;
  }

  &__link {
    background-color: #2196f3;
    color: white;
    padding: 10px 20px;
    margin-inline: $padding;
    margin-bottom: $padding;
    border-radius: 5px;
    text-decoration: none;
    font-weight: bold;
    font-size: 1.5rem;
    cursor: pointer;
    text-align: center;
  }
}
</style>
