import { flags } from '@oclif/command'
import Base from '../base'

export default class Unlink extends Base {
  static description = 'remove a relation between nodes'

  static flags = {
    ...Base.flags,
    help: flags.help({ char: 'h' }),
    undirected: flags.boolean({ char: 'u', description: 'remove edges both ways (if exist)' }),
  }

  static args = [
    { name: 'from', required: true, description: 'starting node' },
    { name: 'to', required: true, description: 'ending node' },
    { name: 'type', required: true, description: 'relation type' },
  ]

  checkLinkageExists(from: string, to: string) {
    if (!this.people.some(person => person.name === from)) {
      this.error(`Did not find ${from} in the list of nodes`)
    }
    if (!this.people.some(person => person.name === to)) {
      this.error(`Did not find ${to} in the list of nodes`)
    }
    if (from === to) {
      this.warn(`Removing a relation from ${from} to ${to}`)
    }
  }

  unlink(from: string, to: string, type: string) {
    this.checkLinkageExists(from, to)
    const fromPerson = this.people.find(person => person.name === from)!
    const existingConnection = fromPerson.connections.find(connection => connection.name === to)
    if (!existingConnection || !existingConnection.relations.some(relation => relation.type === type)) {
      this.error(`${from}: no relation ${type} to ${to} to remove`)
    }
    existingConnection.relations = existingConnection.relations.filter(relation => relation.type !== type)
    // Drop connection entirely if no more relations
    if (existingConnection.relations.length === 0) {
      fromPerson.connections = fromPerson.connections.filter(connection => connection !== existingConnection)
    }
  }

  async run() {
    const { args, flags } = this.parse(Unlink)
    this.unlink(args.from, args.to, args.type)
    if (flags.undirected) {
      this.unlink(args.to, args.from, args.type)
    }
    this.save(this.outputDir)
  }
}
