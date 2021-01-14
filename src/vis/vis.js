/* eslint-disable no-undef */

const nodes = new vis.DataSet()
const edges = new vis.DataSet()
let people = []
let relationsConf = {}

// create a network
const container = document.querySelector('#network')
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

function replaceNodes() {
  nodes.clear()
  nodes.add(people.map(person => ({
    id: person.name,
    label: person.name,
    title: person.notes,
  })))
}

function replaceEdges() {
  edges.clear()
  const edgeList = people.map(person =>
    person.connections.map(connection =>
      connection.relations.map(relation => ({
        from: person.name,
        to: connection.name,
        arrows: 'to',
        type: relation.type,
        color: relationsConf[relation.type]?.color ?? null,
        width: relationsConf[relation.type]?.width ?? null,
        title: relation.notes,
      }))
    ).flat()
  ).flat()
  edges.add(doubleDirectedToUndirected(edgeList)) // perhaps make it an option
}

async function loadFiles(fileList) {
  const files = [...fileList]
  const filesText = await Promise.all(files.map(file => file.text()))
  people = filesText.map(file => JSON.parse(file))
  replaceNodes()
  replaceEdges()
}

const fileSelect = document.querySelector('#fileSelect')
fileSelect.addEventListener('change', () => loadFiles(fileSelect.files))

function updateRelationsTable(table) {
  if (Object.keys(relationsConf).length > 0) {
    table.style.display = 'table'
    while (table.rows.length > 1) {
      table.deleteRow(-1)
    }
    for (const relation of Object.keys(relationsConf)) {
      const row = table.insertRow()
      const relationCell = row.insertCell()
      relationCell.appendChild(document.createTextNode(relation))
      relationCell.style.color = relationsConf[relation].color
      const widthCell = row.insertCell()
      widthCell.appendChild(document.createTextNode(relationsConf[relation].width))
      widthCell.style.color = relationsConf[relation].color
    }
  } else {
    table.style.display = 'none'
  }
}

async function loadConf(conf) {
  const confText = await conf.text()
  relationsConf = JSON.parse(confText)
  updateRelationsTable(document.querySelector('#relationsTable'))
  if (people) {
    replaceEdges()
  }
}

const confSelect = document.querySelector('#confSelect')
confSelect.addEventListener('change', () => loadConf(confSelect.files[0]))
