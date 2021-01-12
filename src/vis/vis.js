const fileSelect = this.document.querySelector('#fileSelect')

async function loadFiles(fileList) {
  const files = [...fileList]
  const filesText = await Promise.all(files.map(file => file.text()))
  const filesJson = filesText.map(file => JSON.parse(file))
  // eslint-disable-next-line no-console
  console.log(filesJson)
}

fileSelect.addEventListener('change', () => loadFiles(fileSelect.files))
