<script setup>
	const files = ref({});
	onMounted(() => {
		new Dropzone('#dz', {
			url: '/',
			autoProcessQueue: false,
			autoQueue: false,
			disablePreviews: true,
			init: function () {
				this.hiddenFileInput.setAttribute('directory', true);
				this.hiddenFileInput.setAttribute('webkitdirectory', true);
				this.hiddenFileInput.setAttribute('mozdirectory', true);
				this.on('addedfiles', (files) => {
					console.log(files);
					console.log(this.files);
				});
				this.drop = async function (e) {
					if (!e.dataTransfer) {
						return;
					}
					this.emit('drop', e);
					let files = [];
					for (let i = 0; i < e.dataTransfer.files.length; i++) {
						files[i] = e.dataTransfer.files[i];
					}
					if (files.length) {
						let { items } = e.dataTransfer;
						if (items && items.length && items[0].webkitGetAsEntry != null) {
							await this._addFilesFromItems(items);
						} else {
							this.handleFiles(files);
						}
					}
					this.emit('addedfiles', files);
				};
				this._addFilesFromItems = function (items) {
					return new Promise(async (resolve) => {
						let result = [];
						for (let item of items) {
							var entry;
							if (
								item.webkitGetAsEntry != null &&
								(entry = item.webkitGetAsEntry())
							) {
								if (entry.isFile) {
									result.push(this.addFile(item.getAsFile()));
								} else if (entry.isDirectory) {
									result.push(
										await this._addFilesFromDirectory(entry, entry.name)
									);
								} else {
									result.push(undefined);
								}
							} else if (item.getAsFile != null) {
								if (item.kind == null || item.kind === 'file') {
									result.push(this.addFile(item.getAsFile()));
								} else {
									result.push(undefined);
								}
							} else {
								result.push(undefined);
							}
						}
						resolve(result);
					});
				};
				this._addFilesFromDirectory = async function (directory, path) {
					let dirReader = directory.createReader();

					let errorHandler = (error) =>
						__guardMethod__(console, 'log', (o) => o.log(error));

					var readEntries = () => {
						return dirReader.readEntries(async (entries) => {
							if (entries.length > 0) {
								for (let entry of entries) {
									if (entry.isFile) {
										entry.file(async (file) => {
											if (
												this.options.ignoreHiddenFiles &&
												file.name.substring(0, 1) === '.'
											) {
												return;
											}
											file.fullPath = `${path}/${file.name}`;
											return this.addFile(file);
										});
									} else if (entry.isDirectory) {
										await this._addFilesFromDirectory(
											entry,
											`${path}/${entry.name}`
										);
									}
								}

								// Recursively call readEntries() again, since browser only handle
								// the first 100 entries.
								// See: https://developer.mozilla.org/en-US/docs/Web/API/DirectoryReader#readEntries
								readEntries();
							}
							return null;
						}, errorHandler);
					};

					return readEntries();
				};
			},
		});
	});
</script>

<template>
	<section id="genertor">
		<div id="dz">Przeciągnij pliki lub kliknij i wybierz folder</div>
	</section>
</template>

<style lang="scss"></style>
