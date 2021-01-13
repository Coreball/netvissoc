/* eslint-disable no-undef */

// create an array with nodes
const nodes = new vis.DataSet([
  { id: 1, label: 'Node 1' },
  { id: 2, label: 'Node 2' },
  { id: 3, label: 'Node 3' },
  { id: 4, label: 'Node 4' },
  { id: 5, label: 'Node 5' },
])

// create an array with edges
const edges = new vis.DataSet([
  { from: 1, to: 3 },
  { from: 1, to: 2 },
  { from: 2, to: 4 },
  { from: 2, to: 5 },
  { from: 3, to: 3 },
])

// create a network
const container = this.document.querySelector('#network')
const data = {
  nodes: nodes,
  edges: edges,
}
const options = {}
const network = new vis.Network(container, data, options)

const fileSelect = this.document.querySelector('#fileSelect')

async function loadFiles(fileList) {
  const files = [...fileList]
  const filesText = await Promise.all(files.map(file => file.text()))
  const filesJson = filesText.map(file => JSON.parse(file))
  // eslint-disable-next-line no-console
  console.log(filesJson)
}

fileSelect.addEventListener('change', () => loadFiles(fileSelect.files))
