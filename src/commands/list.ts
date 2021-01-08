import {flags} from '@oclif/command'
import {cli} from 'cli-ux'
import Base from '../base'
import {Person} from '../defs'

export default class List extends Base {
  static description = 'list nodes and number of connections (extended)'

  static flags = {
    ...Base.flags,
    ...cli.table.flags(), // Note: --output from cli.table overrides --output from base command
    help: flags.help({char: 'h'}),
  }

  uniqueRelations(people: Person[]): Set<string> {
    const uniqueRelations = new Set<string>()
    people.forEach(person =>
      person.connections.forEach(connection =>
        connection.relations.forEach(relation =>
          uniqueRelations.add(relation.type))))
    return uniqueRelations
  }

  relationColumns() {
    const relationTypes = [...this.uniqueRelations(this.people)]
    return relationTypes.map(relationType => ({
      [relationType]: {
        minWidth: 14,
        extended: true,
        get: (person: Person) => person.connections.filter(connection =>
          connection.relations.some(relation =>
            relation.type === relationType)
        ).length,
      },
    })).reduce((acc, curr) => ({...acc, ...curr}), {})
  }

  async run() {
    const {flags} = this.parse(List)
    cli.table(this.people, {
      name: {},
      notes: {
        minWidth: 28,
      },
      connections: {
        header: 'Total Connections',
        get: person => person.connections.length,
      },
      ...this.relationColumns(),
    }, flags)
  }
}
