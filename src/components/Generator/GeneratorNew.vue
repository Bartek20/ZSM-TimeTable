<script setup>
const files = ref([]);
onMounted(() => {
  new Dropzone('#dz', {
    url: '/',
    paramName: 'timetableData',
    autoProcessQueue: false,
    autoQueue: false,
    disablePreviews: true,
    accept: (file, done) => {
      const timetableRegEx = /[ons]{1}\d+\.html/;
      const timetableComponents = []
        .concat(['index.html', 'lista.html'])
        .concat(['lista.css', 'plan.css'])
        .concat(['logo_min.jpg', 'minus.gif', 'plan_logo.gif', 'plus.gif', 'pusty.gif'])
        .concat(['plan.js', 'powrot.js']);
      if (timetableComponents.includes(file.name) || timetableRegEx.test(file.name)) done();
      else done(`Plik ${file.name} nie jest odpowiednim plikiem planu lekcji.`);
    },
    init: function () {
      this.hiddenFileInput.setAttribute('directory', true);
      this.hiddenFileInput.setAttribute('webkitdirectory', true);
      this.hiddenFileInput.setAttribute('mozdirectory', true);
      this.on('addedfiles', (file) => {
        files.value = this.getAcceptedFiles();
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
            if (item.webkitGetAsEntry != null && (entry = item.webkitGetAsEntry())) {
              if (entry.isFile) {
                result.push(this.addFile(item.getAsFile()));
              } else if (entry.isDirectory) {
                result.push(await this._addFilesFromDirectory(entry, entry.name));
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
        async function readEntriesPromise(directoryReader) {
          try {
            return await new Promise((resolve, reject) => {
              directoryReader.readEntries(resolve, reject);
            });
          } catch (err) {
            console.log(err);
          }
        }
        function getFile(entry) {
          return new Promise(async (resolve) => {
            entry.file(resolve);
          });
        }
        var entries = await readEntriesPromise(dirReader);
        while (entries.length > 0) {
          for (let entry of entries) {
            if (entry.isFile) {
              const file = await getFile(entry);
              if (this.options.ignoreHiddenFiles && file.name.substring(0, 1) === '.') {
                return;
              }
              file.fullPath = `${path}/${file.name}`;
              this.addFile(file);
            } else if (entry.isDirectory) {
              await this._addFilesFromDirectory(entry, `${path}/${entry.name}`);
            }
          }
          entries = await readEntriesPromise(dirReader);
        }
      };
    },
  });
});
</script>

<template>
  <section id="generator" v-if="!files.length">
    <div id="dz">Przeciągnij pliki lub kliknij i wybierz folder</div>
  </section>
</template>

<style lang="scss"></style>
