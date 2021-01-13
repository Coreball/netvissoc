/* eslint-disable no-undef */

const nodes = new vis.DataSet()
const edges = new vis.DataSet()

// create a network
const container = this.document.querySelector('#network')
const data = {
  nodes: nodes,
  edges: edges,
}
const options = {
  nodes: {
    shape: 'circle',
  },
}
const network = new vis.Network(container, data, options)

function colorType(relationType) {
  return 'grey'
}

function addToNodes(people) {
  nodes.add(people.map(person => ({
    id: person.name,
    label: person.name,
    title: person.notes,
  })))
}

function addToEdges(people) {
  edges.add(people.map(person =>
    person.connections.map(connection =>
      connection.relations.map(relation => ({
        from: person.name,
        to: connection.name,
        arrows: 'to',
        color: colorType(relation.type),
        title: relation.notes,
      }))
    ).flat()
  ).flat())
}

async function loadFiles(fileList) {
  const files = [...fileList]
  const filesText = await Promise.all(files.map(file => file.text()))
  const filesJson = filesText.map(file => JSON.parse(file))
  addToNodes(filesJson)
  addToEdges(filesJson)
}

const fileSelect = this.document.querySelector('#fileSelect')
fileSelect.addEventListener('change', () => loadFiles(fileSelect.files))
