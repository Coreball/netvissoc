/* eslint-disable no-undef */

const nodes = new vis.DataSet()
const edges = new vis.DataSet()
let people = []
let relationsConf = {}

// edge settings
const smoothEdges = {
  edges: { smooth: true },
  physics: {
    barnesHut: {
      gravitationalConstant: -10000,
      centralGravity: 2,
      springConstant: 0.005,
    },
  },
}
const straightEdges = {
  edges: { smooth: false },
  physics: {
    barnesHut: {
      gravitationalConstant: -80000,
      centralGravity: 2,
      springConstant: 0.005,
    },
  },
}

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

// graph loading
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

function peopleToNodes() {
  return people.map(person => ({
    id: person.name,
    label: person.name,
    title: person.notes,
    color: null,
  }))
}

function replaceNodes() {
  nodes.clear()
  nodes.add(peopleToNodes())
}

function relationsToEdges() {
  return people.flatMap(person =>
    person.connections.flatMap(connection =>
      connection.relations.map(relation => ({
        id: person.name + connection.name + relation.type, // not bulletproof
        from: person.name,
        to: connection.name,
        arrows: 'to',
        type: relation.type,
        color: relationsConf[relation.type]?.color ?? null,
        width: relationsConf[relation.type]?.width ?? null,
        title: relation.notes,
      }))
    )
  )
}

function replaceEdges() {
  edges.clear()
  edges.add(doubleDirectedToUndirected(relationsToEdges())) // perhaps make it an option
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

// config file, colors and widths for edges
function updateRelationsTable(table) {
  if (Object.keys(relationsConf).length > 0) {
    table.classList.remove('hidden')
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
    table.classList.add('hidden')
  }
}

async function loadConf(conf) {
  const confText = await conf.text()
  relationsConf = JSON.parse(confText)
  updateRelationsTable(document.querySelector('.relationsTable'))
  if (people) {
    replaceEdges()
  }
}

const confSelect = document.querySelector('#confSelect')
confSelect.addEventListener('change', () => loadConf(confSelect.files[0]))

// smooth edges
function enableSmoothEdges(smooth) {
  network.setOptions({ ...options, ...(smooth ? smoothEdges : straightEdges) })
}

const smoothCheck = document.querySelector('#smoothCheck')
smoothCheck.addEventListener('change', () => enableSmoothEdges(smoothCheck.checked))
enableSmoothEdges(smoothCheck.checked) // for browsers that persist dynamic checked state

// info box
const sortNameCheck = document.querySelector('#sortNameCheck')
const sortRelationCheck = document.querySelector('#sortRelationCheck')
let currentPerson = null
let currentEdge = null

function updateInfoNode(infoDiv) {
  infoDiv.querySelector('.name').textContent = currentPerson.name
  infoDiv.querySelector('.notes').textContent = currentPerson.notes
  const connectionList = infoDiv.querySelector('.connectionList')
  while (connectionList.firstChild) {
    connectionList.removeChild(connectionList.firstChild)
  }

  const personConnections = [...currentPerson.connections]
  if (sortNameCheck.checked) {
    personConnections.sort((a, b) => a.name.localeCompare(b.name))
  }
  if (sortRelationCheck.checked) {
    personConnections.sort((a, b) =>
      relationsConf[b.relations[0].type].width - relationsConf[a.relations[0].type].width)
  }

  personConnections.forEach(connection => {
    const connectionItem = document.createElement('li')
    connectionItem.appendChild(document.createTextNode(connection.name))
    if (connection.relations.length > 0) {
      const relationList = document.createElement('ul')
      connection.relations.forEach(relation => {
        const relationItem = document.createElement('li')
        const text = relation.type + (relation.notes ? ` - ${relation.notes}` : '')
        relationItem.appendChild(document.createTextNode(text))
        relationList.appendChild(relationItem)
        relationItem.style.color = relationsConf[relation.type].color
      })
      connectionItem.appendChild(relationList)
    }
    connectionList.appendChild(connectionItem)
  })
}

function updateInfoEdge(infoDiv) {
  infoDiv.querySelector('.name').textContent = currentEdge.type
  infoDiv.querySelector('.notes').textContent = currentEdge.title
  const connectionList = infoDiv.querySelector('.connectionList')
  while (connectionList.firstChild) {
    connectionList.removeChild(connectionList.firstChild)
  }
}

function updateInfoClick(infoDiv, nodeId, edgeId) {
  if (nodeId) {
    currentPerson = people.find(person => person.name === nodeId)
    currentEdge = null
    updateInfoNode(infoDiv)
    infoDiv.classList.remove('hidden')
  } else if (edgeId) {
    currentPerson = null
    currentEdge = edges.get(edgeId)
    updateInfoEdge(infoDiv)
    infoDiv.classList.remove('hidden')
  } else {
    currentPerson = null
    currentEdge = null
    infoDiv.classList.add('hidden')
  }
}

function updateInfoWithCurrent(infoDiv) {
  if (currentPerson) {
    updateInfoNode(infoDiv)
  } else if (currentEdge) {
    updateInfoEdge(infoDiv)
  }
}

const info = document.querySelector('.info')
network.on('click', click => updateInfoClick(info, click.nodes[0], click.edges[0]))
sortNameCheck.addEventListener('change', () => updateInfoWithCurrent(info))
sortRelationCheck.addEventListener('change', () => updateInfoWithCurrent(info))

// neighborhood highlight
let highlightActive = false

function neighborhoodHighlight(nodeId) {
  if (nodeId) {
    highlightActive = true
    const updatedNodes = peopleToNodes().map(
      person => person.id === nodeId ?
        person : { ...person, color: '#eee' })
    const updatedEdges = relationsToEdges().map(
      edge => edge.from === nodeId || edge.to === nodeId ?
        edge : { ...edge, color: '#eee' })
    nodes.update(updatedNodes)
    edges.update(doubleDirectedToUndirected(updatedEdges))
  } else if (highlightActive) {
    highlightActive = false
    nodes.update(peopleToNodes())
    edges.update(doubleDirectedToUndirected(relationsToEdges()))
  }
}

network.on('click', click => neighborhoodHighlight(click.nodes[0]))
