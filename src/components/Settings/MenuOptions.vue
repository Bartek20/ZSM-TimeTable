<script setup>
import appConfigs from "@/stores/configs";
import appData from "@/stores/data";
const mode = useRouteParams("mode");
const id = useRouteParams("id");
function printTimeTable() {
  // Open printed page
  const page = window.open(
    `${appConfigs.value.school.timetableURL}plany/${mode.value}${id.value}.html`,
    "_print",
  );
  if (!page) return;
  // Hide unnecessary items and open print dialog
  page.onload = () => {
    const style = page.document.createElement("style");
    style.textContent = `a {
				text-decoration: none;
				color: inherit;
			}
				body > div:nth-child(2) > table > tbody > tr:nth-child(3),
				body > div:nth-child(2) > table > tbody > tr:nth-child(4) {
					display: none
				}
				.tabtytul {
					display:table;
					color:black
				}
				@media print {
					body {
						height:100vh;
						width:100vw;
					}
					@page {
						orientation:landscape !important;
						size:A4 landscape !important;
						margin: 0.5cm;
					}
				}`;
    page.document.head.appendChild(style);
    // Template
    const template =
      '<tr><td align="left">{gen}</td><td align="right">{apply}</td></tr>';
    // Variables
    const genDateValue = /(.*)<br>/
      .exec(
        page.document.querySelector(
          "body > div:nth-child(2) > table > tbody > tr:nth-child(3) > td.op > table > tbody > tr > td:nth-child(1)",
        ).innerHTML,
      )[1]
      .trim();
    const genDate =
      genDateValue.charAt(0).toUpperCase() + genDateValue.slice(1);
    const appDate = page.document
      .querySelector(
        "body > div:nth-child(2) > table > tbody > tr:nth-child(2) > td",
      )
      .innerHTML.trim();
    // Change footer
    page.document.querySelector(
      "body > div:nth-child(2) > table > tbody > tr:nth-child(2)",
    ).innerHTML = template
      .replace("{gen}", genDate)
      .replace("{apply}", appDate);

    // Print page
    page.print();
  };
  // Close page after print
  page.onafterprint = () => {
    page.close();
  };
}
const status = computed(() => appData.timetable.value.status);
</script>

<template>
  <div class="configs__options" v-if="status == 200">
    <span class="configs__options__title"><b>Opcje</b></span>
    <a
      class="configs__options__option"
      :href="`${appConfigs.school.timetableURL}plany/${mode}${id}.html`"
      target="_blank"
    >
      <i class="configs__options__option__icon zsm-old-timetable-icon"></i>
      <span class="configs__options__option__name">Otwórz oryginalny plan</span>
    </a>
    <div class="configs__options__option" @click="printTimeTable">
      <i class="configs__options__option__icon zsm-print-timetable-icon"></i>
      <span class="configs__options__option__name">Wydrukuj plan</span>
    </div>
  </div>
  <div v-else></div>
</template>

<style lang="scss">
.configs__options {
  margin-inline: 0.75rem;
  &__title {
    font-size: 1.1rem;
    + * {
      margin-top: 0.25rem;
    }
  }
  > *:not(span):not(label):not(:last-child) {
    margin-bottom: 0.25rem;
  }
  &__option {
    padding: 0.25rem 0.75rem 0.25rem 0;
    text-decoration: none;
    color: var(--sb-text);
    height: 50px;
    display: flex;
    align-items: center;
    cursor: pointer;
    &__icon {
      display: block;
      font-size: 20px;
      min-width: 40px;
      text-align: center;
    }
    &__name {
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
