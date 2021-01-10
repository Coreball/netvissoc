import { flags } from '@oclif/command'
import Base from '../base'

export default class Check extends Base {
  static description = 'check for and display potential problems with input files'

  static flags = {
    ...Base.inputFlag,
    help: flags.help({ char: 'h' }),
  }

  allOk = true

  warn(input: string | Error) {
    super.warn(input)
    this.allOk = false
  }

  checkPeople(people: any[]) {
    const allNames: string[] = []
    for (const person of people) {
      let name = 'Unnamed Person'
      if (typeof person !== 'object') {
        this.warn(`${name} is not an object!`)
        continue
      }
      if ('name' in person && typeof person.name === 'string') {
        name = person.name
        if (allNames.includes(name)) {
          this.warn(`${name} is a duplicate top-level name`)
        }
        allNames.push(name)
      } else {
        this.warn(`${name} does not have a string 'name' field`)
      }
      if (!('notes' in person) || typeof person.notes !== 'string') {
        this.warn(`${name} does not have a string 'notes' field`)
      }
      if ('connections' in person && Array.isArray(person.connections)) {
        this.checkConnections(name, person.connections)
      } else {
        this.warn(`${name} does not have an array 'connections' field`)
      }
    }
  }

  checkConnections(name: string, connections: any[]) {
    const allConnectionNames: string[] = []
    for (const connection of connections) {
      let connectionName = 'Unnamed Connection'
      if (typeof connection !== 'object') {
        this.warn(`${name}: ${connectionName} is not an object!`)
        continue
      }
      if ('name' in connection && typeof connection.name === 'string') {
        connectionName = connection.name
        if (allConnectionNames.includes(connectionName)) {
          this.warn(`${name}: ${connectionName} is a duplicate connection name`)
        }
        allConnectionNames.push(connectionName)
      } else {
        this.warn(`${name}: ${connectionName} does not have a string 'name' field`)
      }
      if ('relations' in connection && Array.isArray(connection.relations)) {
        this.checkRelations(name, connectionName, connection.relations)
      } else {
        this.warn(`${name}: ${connectionName} does not have an array 'relations' field`)
      }
    }
  }

  checkRelations(name: string, connectionName: string, relations: any[]) {
    const allRelationTypes: string[] = []
    for (const relation of relations) {
      let relationType = 'Unnamed Relation'
      if (typeof relation !== 'object') {
        this.warn(`${name}: ${connectionName}: ${relationType} is not an object!`)
        continue
      }
      if ('type' in relation && typeof relation.type === 'string') {
        relationType = relation.type
        if (allRelationTypes.includes(relationType)) {
          this.warn(`${name}: ${connectionName}: ${relationType} is a duplicate relation type`)
        }
        allRelationTypes.push(relationType)
      } else {
        this.warn(`${name}: ${connectionName}: ${relationType} does not have a string 'type' field`)
      }
      if (!('notes' in relation) || typeof relation.notes !== 'string') {
        this.warn(`${name}: ${connectionName}: ${relationType} does not have a string 'notes' field`)
      }
    }
  }

  async run() {
    this.checkPeople(this.people)
    if (this.allOk) this.log('All OK!')
  }
}
