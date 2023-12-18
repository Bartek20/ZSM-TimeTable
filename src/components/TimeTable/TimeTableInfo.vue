<script setup>
	import schoolData from '../../assets/schoolData.json';
	const user = useRouteParams('user');
	const mode = useRouteParams('mode');
	const id = useRouteParams('id');
	const props = defineProps({
		title: {
			type: String,
			required: true,
		},
	});
	function closeInfo() {
		const el = document.getElementById('info');
		if (el) el.classList.toggle('toggled');
	}
</script>

<template>
	<Teleport to="body">
		<section id="info" class="inset-0 d-flex align-items-center justify-content-center">
			<div class="p-4 bg-white rounded-4">
				<div>
					<h2>Informacje o planie</h2>
					<div class="row fw-bold">
						<div class="col-2">ID</div>
						<div class="col text-nowrap">Nazwa planu</div>
					</div>
					<div class="row">
						<div class="col-2">{{ mode.toUpperCase() + id }}</div>
						<div class="col text-nowrap">{{ title }}</div>
					</div>
				</div>
				<div class="mt-3">
					<h2>Opcje planu</h2>
					<RouterLink class="row my-1 text-decoration-none text-body" target="_blank" :to="{ name: 'print', params: { user: user, mode: mode, id: id } }">
						<div class="col-2">
							<div class="fn-btn m-auto">
								<div class="btn-info">
									<i class="d-block zsm-print-icon"></i>
								</div>
							</div>
						</div>
						<div class="col ps-0 text-nowrap">Wydrukuj plan</div>
					</RouterLink>

					<a :href="schoolData.schoolTimeTableRootURL + 'plany/' + mode + id + '.html?app=original'" target="_blank" class="row my-1 text-decoration-none text-body">
						<div class="col-2">
							<div class="fn-btn m-auto">
								<div class="btn-info">
									<i class="d-block zsm-old-icon"></i>
								</div>
							</div>
						</div>
						<div class="col ps-0 text-nowrap">Otwórz oryginalny plan</div>
					</a>
				</div>
			</div>
			<section id="infoOverlay" class="z-n1 position-fixed inset-0" @click="closeInfo"></section>
		</section>
	</Teleport>
</template>

<style lang="scss">
	#info {
		font-size: 1.2rem;
		position: absolute;
		z-index: -10;
		&.toggled {
			z-index: 10000;
		}
		.fn-btn {
			width: 30px;
			i {
				font-size: 26px;
			}
		}
		#infoOverlay {
			background-color: rgba(0, 0, 0, 0.4);
		}
	}
</style>
