import { flags } from '@oclif/command'
import Base from '../base'

export default class Delete extends Base {
  static description = 'remove all occurrences of name and delete corresponding file'

  static examples = [
    '$ netvissoc delete -i ./test -o ./test "Bill Smoke"',
  ]

  static flags = {
    ...Base.flags,
    help: flags.help({ char: 'h' }),
  }

  static args = [
    { name: 'name', required: true, description: 'name to be deleted' },
  ]

  remove(name: string) {
    this.people.forEach(person => {
      person.connections = person.connections.filter(connection =>
        connection.name !== name)
    })
    this.people = this.people.filter(person => person.name !== name)
  }

  async run() {
    const { args } = this.parse(Delete)
    this.remove(args.name)
    this.save(this.outputDir)
    if (this.areDirsSame(this.inputDir, this.outputDir)) {
      this.removeFile(this.inputDir, args.name)
    }
  }
}
