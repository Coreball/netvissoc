import { Command, flags } from '@oclif/command'
import * as path from 'path'
import { cli } from 'cli-ux'

export default class Graph extends Command {
  static description = 'open network visualization tool'

  static flags = {
    help: flags.help({ char: 'h' }),
  }

  async run() {
    this.parse(Graph)
    const vis = path.join(__dirname, '..', 'vis', 'vis.html')
    await cli.open(vis)
  }
}
