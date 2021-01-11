import { flags } from '@oclif/command'
import Base from '../base'

export default class Add extends Base {
  static description = 'add a new node without connections'

  static examples = [
    '$ netvissoc add -i ./test -o ./test "Adam Ewing" -n "An American lawyer from San Francisco"',
  ]

  static flags = {
    ...Base.flags,
    help: flags.help({ char: 'h' }),
    notes: flags.string({ char: 'n', description: 'optional notes' }),
  }

  static args = [
    { name: 'name', required: true, description: 'name to be added' },
  ]

  add(name: string, notes?: string) {
    if (this.people.some(person => person.name === name)) {
      this.error(name + ' was already in the list of nodes, did not add again')
    }
    this.people.push({
      name: name,
      notes: notes ?? '',
      connections: [],
    })
  }

  async run() {
    const { args, flags } = this.parse(Add)
    this.add(args.name, flags.notes)
    this.save(this.outputDir)
  }
}
