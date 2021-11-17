multidao
========

CLI Tool used to interact with the Multi tenant DHO Software

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/multidao.svg)](https://npmjs.org/package/multidao)
[![Downloads/week](https://img.shields.io/npm/dw/multidao.svg)](https://npmjs.org/package/multidao)
[![License](https://img.shields.io/npm/l/multidao.svg)](https://github.com/Gerard097/multidao/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g multidao
$ multidao COMMAND
running command...
$ multidao (-v|--version|version)
multidao/0.0.0 linux-x64 node-v16.13.0
$ multidao --help [COMMAND]
USAGE
  $ multidao COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`multidao create [FILE]`](#multidao-create-file)
* [`multidao help [COMMAND]`](#multidao-help-command)
* [`multidao propose [FILE]`](#multidao-propose-file)

## `multidao create [FILE]`

Creates a dao

```
USAGE
  $ multidao create [FILE]

OPTIONS
  -f, --file=file  Configuration file (yaml)
  -h, --help       show CLI help

EXAMPLE
  $ multidao create -f config.yaml
```

_See code: [src/commands/create.ts](https://github.com/Gerard097/multidao/blob/v0.0.0/src/commands/create.ts)_

## `multidao help [COMMAND]`

display help for multidao

```
USAGE
  $ multidao help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.4/src/commands/help.ts)_

## `multidao propose [FILE]`

describe the command here

```
USAGE
  $ multidao propose [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/propose.ts](https://github.com/Gerard097/multidao/blob/v0.0.0/src/commands/propose.ts)_
<!-- commandsstop -->
