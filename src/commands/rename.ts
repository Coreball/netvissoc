import { flags } from '@oclif/command'
import Base from '../base'
import { Person, Connection } from '../defs'

export default class Rename extends Base {
  static description = 'rename a node'

  static flags = {
    ...Base.flags,
    help: flags.help({ char: 'h' }),
  }

  static args = [
    { name: 'old', required: true, description: 'old name' },
    { name: 'new', required: true, description: 'new name' },
  ]

  rename(oldName: string, newName: string) {
    // Rename occurrences in connections
    this.people.forEach(person => {
      const oldConn = person.connections.find(connection => connection.name === oldName)
      if (oldConn) {
        const newConn = person.connections.find(connection => connection.name === newName)
        if (newConn) {
          this.mergeConnections(oldConn, newConn) // Mutate newConn to contain all relations of oldConn
          person.connections = person.connections.filter(conn => conn !== oldConn) // Remove oldConn
        } else {
          oldConn.name = newName // If no newConn just rename oldConn
        }
      }
    })
    // Rename main person
    const oldPerson = this.people.find(person => person.name === oldName)
    if (oldPerson) {
      const newPerson = this.people.find(person => person.name === newName)
      if (newPerson) {
        this.mergePersons(oldPerson, newPerson) // newPerson to contain all connections of oldPerson
        this.people = this.people.filter(person => person !== oldPerson)
      } else {
        oldPerson.name = newName
      }
    } else {
      this.error(`Did not find ${oldName} in list of nodes, could not rename`)
    }
  }

  mergeConnections(oldConn: Connection, newConn: Connection) {
    newConn.relations = oldConn.relations.reduce((acc, curr) => {
      const existingRelation = acc.find(rel => rel.type === curr.type)
      if (existingRelation) {
        if (curr.notes) {
          existingRelation.notes += '\n' + curr.notes
        }
        return acc
      }
      return [...acc, curr]
    }, newConn.relations)
  }

  mergePersons(oldPerson: Person, newPerson: Person) {
    if (oldPerson.notes) {
      newPerson.notes += '\n' + oldPerson.notes
    }
    newPerson.connections = oldPerson.connections.reduce((acc, curr) => {
      const existingConn = acc.find(conn => conn.name === curr.name)
      if (existingConn) { // Merge into connection already in acc if has same name as curr
        this.mergeConnections(curr, existingConn)
        return acc
      }
      return [...acc, curr] // Otherwise add curr to acc list
    }, newPerson.connections)
  }

  async run() {
    const { args } = this.parse(Rename)
    this.rename(args.old, args.new)
    this.save(this.outputDir)
    if (this.areDirsSame(this.inputDir, this.outputDir)) {
      this.removeFile(this.inputDir, args.old)
    }
  }
}
