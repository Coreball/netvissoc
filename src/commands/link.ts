import { flags } from '@oclif/command'
import Base from '../base'

export default class Link extends Base {
  static description = 'create a new relation between nodes'

  static flags = {
    ...Base.flags,
    help: flags.help({ char: 'h' }),
    notes: flags.string({ char: 'n', description: 'relation notes' }),
    undirected: flags.boolean({ char: 'u', description: 'make edges both ways' }),
  }

  static args = [
    { name: 'from', required: true, description: 'starting node' },
    { name: 'to', required: true, description: 'ending node' },
    { name: 'type', required: true, description: 'relation type' },
  ]

  link(from: string, to: string, type: string, notes?: string) {
    // Later: resolve missing nodes automatically/with flag?
    const fromPerson = this.people.find(person => person.name === from)
    if (!fromPerson) {
      this.error(`Did not find ${from} in the list of nodes`)
    }
    if (!this.people.some(person => person.name === to)) {
      this.error(`Did not find ${to} in the list of nodes`)
    }
    if (from === to) {
      this.warn(`Creating a relation from ${from} to ${to}`)
    }
    const existingConnection = fromPerson.connections.find(connection => connection.name === to)
    if (existingConnection) {
      if (existingConnection.relations.some(relation => relation.type === type)) {
        this.error(`${from}: already a relation ${type} to ${to}`)
      }
      existingConnection.relations.push({ type: type, notes: notes ?? '' })
    } else {
      fromPerson.connections.push({
        name: to,
        relations: [
          { type: type, notes: notes ?? '' },
        ],
      })
    }
  }

  async run() {
    const { args, flags } = this.parse(Link)
    this.link(args.from, args.to, args.type, flags.notes)
    if (flags.undirected) {
      this.link(args.to, args.from, args.type, flags.notes)
    }
    this.save(this.outputDir)
  }
}