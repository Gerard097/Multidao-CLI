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
* [`multidao close [FILE]`](#multidao-close-file)
* [`multidao create FILE`](#multidao-create-file)
* [`multidao get TYPE`](#multidao-get-type)
* [`multidao help [COMMAND]`](#multidao-help-command)
* [`multidao propose TYPE FILE [DAO]`](#multidao-propose-type-file-dao)
* [`multidao vote [VOTE] [PROPOSAL]`](#multidao-vote-vote-proposal)

## `multidao close [FILE]`

describe the command here

```
USAGE
  $ multidao close [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/close.ts](https://github.com/Gerard097/multidao/blob/v0.0.0/src/commands/close.ts)_

## `multidao create FILE`

Creates a dao

```
USAGE
  $ multidao create FILE

ARGUMENTS
  FILE  File containing the DAO configuration variables or where the template will be generated if -g is specified
        (YAML)

OPTIONS
  -a, --auth=auth  File containing account and private-key used to sign the transactions

  -g, --generate   If specified, creates a template with the required configuration variables for the dao in the
                   specified file

  -h, --help       show CLI help

EXAMPLE
  $ multidao create -f config.yaml
```

_See code: [src/commands/create.ts](https://github.com/Gerard097/multidao/blob/v0.0.0/src/commands/create.ts)_

## `multidao get TYPE`

Retreives a list of document types

```
USAGE
  $ multidao get TYPE

ARGUMENTS
  TYPE  (assignment|role|dao|period) Type of the documents to list

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/get.ts](https://github.com/Gerard097/multidao/blob/v0.0.0/src/commands/get.ts)_

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

## `multidao propose TYPE FILE [DAO]`

Creates a proposal document for an specific dao

```
USAGE
  $ multidao propose TYPE FILE [DAO]

ARGUMENTS
  TYPE  (assignment|role|contribution) Proposal type
  FILE  File containing the proposal information or where the template will be generated if -g is specified
  DAO   DAO where the proposal will be created

OPTIONS
  -a, --auth=auth  File containing account and private-key used to sign the transactions

  -g, --generate   If specified, creates a template with the required parameters for the proposal type in the specified
                   file

  -h, --help       show CLI help

EXAMPLES
  $ multidao propose -f assignment.yaml -a generate
  $ multidao propose hypha -f assignment.yaml -a
```

_See code: [src/commands/propose.ts](https://github.com/Gerard097/multidao/blob/v0.0.0/src/commands/propose.ts)_

## `multidao vote [VOTE] [PROPOSAL]`

Casts a vote to the specified proposal

```
USAGE
  $ multidao vote [VOTE] [PROPOSAL]

ARGUMENTS
  VOTE      (pass|abstain|fail) Vote option
  PROPOSAL  Hash of the proposal being voted on

OPTIONS
  -a, --auth=auth    (required) File containing account and private-key used to sign the transactions
  -h, --help         show CLI help
  -n, --notes=notes  Notes added to the vote
```

_See code: [src/commands/vote.ts](https://github.com/Gerard097/multidao/blob/v0.0.0/src/commands/vote.ts)_
<!-- commandsstop -->
