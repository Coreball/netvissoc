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
    shape: 'dot',
  },
}
const network = new vis.Network(container, data, options)

function colorType(relationType) {
  return 'grey'
}

function doubleDirectedToUndirected(edgeList) {
  const newList = []
  edgeList.forEach(curr => {
    const existingEdge = newList.find(edge =>
      edge.from === curr.to && edge.to === curr.from && edge.type === curr.type)
    if (existingEdge) {
      existingEdge.arrows = null
      existingEdge.title += ' ' + curr.title
    } else {
      newList.push(curr)
    }
  })
  return newList
}

function replaceNodes(people) {
  nodes.clear()
  nodes.add(people.map(person => ({
    id: person.name,
    label: person.name,
    title: person.notes,
  })))
}

function replaceEdges(people) {
  edges.clear()
  const edgeList = people.map(person =>
    person.connections.map(connection =>
      connection.relations.map(relation => ({
        from: person.name,
        to: connection.name,
        arrows: 'to',
        type: relation.type,
        color: colorType(relation.type),
        title: relation.notes,
      }))
    ).flat()
  ).flat()
  edges.add(doubleDirectedToUndirected(edgeList)) // perhaps make it an option
}

async function loadFiles(fileList) {
  const files = [...fileList]
  const filesText = await Promise.all(files.map(file => file.text()))
  const filesJson = filesText.map(file => JSON.parse(file))
  replaceNodes(filesJson)
  replaceEdges(filesJson)
}

const fileSelect = this.document.querySelector('#fileSelect')
fileSelect.addEventListener('change', () => loadFiles(fileSelect.files))
