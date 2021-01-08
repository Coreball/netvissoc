import {flags} from '@oclif/command'
import * as path from 'path'
import Base from '../base'

export default class Remove extends Base {
  static description = 'remove all occurrences of name and delete corresponding file'

  static flags = {
    ...Base.flags,
    help: flags.help({char: 'h'}),
  }

  static args = [
    {name: 'name', required: true, description: 'name to be deleted'},
  ]

  remove(name: string) {
    this.people.forEach(person => {
      person.connections = person.connections.filter(connection =>
        connection.name !== name)
    })
    this.people = this.people.filter(person => person.name !== name)
  }

  async run() {
    const {args} = this.parse(Remove)
    this.remove(args.name)
    this.save(this.outputDir)
    if (path.normalize(this.inputDir) === path.normalize(this.outputDir)) {
      this.removeFile(this.inputDir, args.name)
    }
  }
}
