/* eslint-disable no-undef */

const scale = d3.scaleOrdinal(d3.schemeCategory10)

function color(d) {
  return scale(d.group)
}

function drag(simulation) {
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart()
    event.subject.fx = event.subject.x
    event.subject.fy = event.subject.y
  }

  function dragged(event) {
    event.subject.fx = event.x
    event.subject.fy = event.y
  }

  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0)
    event.subject.fx = null
    event.subject.fy = null
  }

  return d3.drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended)
}

function simulation(data) {
  const links = data.links.map(d => Object.create(d))
  const nodes = data.nodes.map(d => Object.create(d))

  const width = window.innerWidth
  const height = window.innerHeight

  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2))

  const svg = d3.select('#visArea')

  const link = svg.append('g')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke-width', d => Math.sqrt(d.value))

  const node = svg.append('g')
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('r', 5)
    .attr('fill', color)
    .call(drag(simulation))

  node.append('title')
    .text(d => d.id)

  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)

    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
  })
}

const fileSelect = this.document.querySelector('#fileSelect')

async function loadFiles(fileList) {
  const files = [...fileList]
  const filesText = await Promise.all(files.map(file => file.text()))
  const filesJson = filesText.map(file => JSON.parse(file))
  // eslint-disable-next-line no-console
  console.log(filesJson)
  simulation(filesJson[0])
}

fileSelect.addEventListener('change', () => loadFiles(fileSelect.files))
