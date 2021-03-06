import { flags } from '@oclif/command'
import Base from '../base'

export default class Link extends Base {
  static description = 'create a new relation between nodes (every pair if multiple)'

  static examples = [
    '$ netvissoc link -i ./test -o ./test "Timothy Cavendish" "Denholme Cavendish" "brother" -u',
  ]

  static flags = {
    ...Base.flags,
    help: flags.help({ char: 'h' }),
    notes: flags.string({ char: 'n', description: 'relation notes' }),
    undirected: flags.boolean({ char: 'u', description: 'make edges both ways' }),
  }

  static args = [
    { name: 'from', required: true, description: 'starting node(s), comma-separated' },
    { name: 'to', required: true, description: 'ending node(s), comma-separated' },
    { name: 'type', required: true, description: 'relation type' },
  ]

  link(from: string, to: string, type: string, notes?: string) {
    this.checkNamesExist(from, to)
    // Later: resolve missing nodes automatically/with flag?
    if (from === to) {
      this.warn(`Creating a relation from ${from} to ${to}`)
    }
    const fromPerson = this.people.find(person => person.name === from)!
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
    const froms = this.splitArg(args.from)
    const tos = this.splitArg(args.to)
    froms.forEach(from => {
      tos.forEach(to => {
        this.link(from, to, args.type, flags.notes)
        if (flags.undirected) {
          this.link(to, from, args.type, flags.notes)
        }
      })
    })
    this.save(this.outputDir)
  }
}
