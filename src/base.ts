import {Command, flags} from '@oclif/command'
import {Input} from '@oclif/parser'
import * as fs from 'fs'
import * as path from 'path'
import {Person} from './defs'

export default abstract class Base extends Command {
  static flags: flags.Input<any> = {
    input: flags.string({
      char: 'i',
      description: 'input directory',
      default: '.',
    }),
    output: flags.string({
      char: 'o',
      description: 'output directory',
      default: '.',
    }),
  }

  inputDir!: string;
  outputDir!: string;

  people!: Person[];

  load(dir: string) {
    const files = fs.readdirSync(dir, 'utf8').filter(file => file.toLowerCase().endsWith('.json'))
    this.people = files.map(file => JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8')))
  }

  save(dir: string) {
    if (!fs.existsSync(dir))
      fs.mkdirSync(dir, {recursive: true})
    this.people.forEach(person =>
      fs.writeFileSync(path.join(dir, person.name.replace(' ', '_') + '.json'),
        JSON.stringify(person, null, 4)))
  }

  async init() {
    const {flags} = this.parse(this.constructor as Input<typeof Base.flags>)
    this.inputDir = flags.input.toString()
    this.outputDir = flags.output.toString()
    try {
      this.load(this.inputDir)
    } catch (error) {
      this.error(error)
    }
  }
}
