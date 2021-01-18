import { flags } from '@oclif/command'
import Base from '../base'
import { Relation } from '../defs'

export default class Relink extends Base {
  static description = 'change or update a relation between nodes (every pair if multiple)'

  static examples = [
    '$ netvissoc relink -i ./test -o ./test "Robert Frobisher" "Vyvyan Ayrs" "music buddy" "music enemy" -u',
    '$ netvissoc relink -i ./test -o ./test "Luisa Rey" "Rufus Sixsmith" "friend" -n "updated notes"',
  ]

  static flags = {
    ...Base.flags,
    help: flags.help({ char: 'h' }),
    notes: flags.string({ char: 'n', description: 'updated relation notes' }),
    undirected: flags.boolean({ char: 'u', description: 'change edges both ways' }),
  }

  static args = [
    { name: 'from', required: true, description: 'starting node(s), comma-separated' },
    { name: 'to', required: true, description: 'ending node(s), comma-separated' },
    { name: 'old', required: true, description: 'relation type to change/update' },
    { name: 'new', required: false, description: 'relation type to change to (optional)' },
  ]

  relink(from: string, to: string, oldType: string, newType: string) {
    this.checkNamesExist(from, to)
    if (from === to) {
      this.warn(`Changing a relation from ${from} to ${to}`)
    }
    const existingRelation = this.getExistingRelation(from, to, oldType)
    existingRelation.type = newType
  }

  updateNotes(from: string, to: string, type: string, notes: string) {
    this.checkNamesExist(from, to)
    if (from === to) {
      this.warn(`Updating notes in a relation from ${from} to ${to}`)
    }
    const existingRelation = this.getExistingRelation(from, to, type)
    existingRelation.notes = notes
  }

  getExistingRelation(from: string, to: string, type: string): Relation {
    const fromPerson = this.people.find(person => person.name === from)
    if (!fromPerson) {
      this.error(`${from}: does not exist`)
    }
    const existingConnection = fromPerson.connections.find(connection => connection.name === to)
    if (!existingConnection) {
      this.error(`${from}: no existing connection to ${to}`)
    }
    const existingRelation = existingConnection.relations.find(relation => relation.type === type)
    if (!existingRelation) {
      this.error(`${from}: no existing relation of type ${type} to ${to}`)
    }
    return existingRelation
  }

  async run() {
    const { args, flags } = this.parse(Relink)
    const froms = this.splitArg(args.from)
    const tos = this.splitArg(args.to)
    froms.forEach(from => {
      tos.forEach(to => {
        if (flags.notes) {
          this.updateNotes(from, to, args.old, flags.notes)
          if (flags.undirected) {
            this.updateNotes(to, from, args.old, flags.notes)
          }
        }
        if (args.new) {
          this.relink(from, to, args.old, args.new)
          if (flags.undirected) {
            this.relink(to, from, args.old, args.new)
          }
        }
      })
    })
    this.save(this.outputDir)
  }
}
