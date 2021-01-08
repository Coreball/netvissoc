netvissoc
=========



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/netvissoc.svg)](https://npmjs.org/package/netvissoc)
[![Downloads/week](https://img.shields.io/npm/dw/netvissoc.svg)](https://npmjs.org/package/netvissoc)
[![License](https://img.shields.io/npm/l/netvissoc.svg)](https://github.com/Coreball/netvissoc/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g netvissoc
$ netvissoc COMMAND
running command...
$ netvissoc (-v|--version|version)
netvissoc/0.0.0 darwin-x64 node-v15.5.1
$ netvissoc --help [COMMAND]
USAGE
  $ netvissoc COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`netvissoc hello [FILE]`](#netvissoc-hello-file)
* [`netvissoc help [COMMAND]`](#netvissoc-help-command)
* [`netvissoc list`](#netvissoc-list)

## `netvissoc hello [FILE]`

describe the command here

```
USAGE
  $ netvissoc hello [FILE]

OPTIONS
  -f, --force
  -h, --help           show CLI help
  -i, --input=input    [default: .] input directory
  -n, --name=name      name to print
  -o, --output=output  [default: .] output directory

EXAMPLE
  $ netvissoc hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/Coreball/netvissoc/blob/v0.0.0/src/commands/hello.ts)_

## `netvissoc help [COMMAND]`

display help for netvissoc

```
USAGE
  $ netvissoc help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.1/src/commands/help.ts)_

## `netvissoc list`

list nodes and number of connections (extended)

```
USAGE
  $ netvissoc list

OPTIONS
  -h, --help              show CLI help
  -i, --input=input       [default: .] input directory
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             property to sort by (prepend '-' for descending)
```

_See code: [src/commands/list.ts](https://github.com/Coreball/netvissoc/blob/v0.0.0/src/commands/list.ts)_
<!-- commandsstop -->
