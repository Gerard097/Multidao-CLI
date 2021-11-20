import {Command, flags} from '@oclif/command'
import { closeProposal, getApi } from '../eosio/api'
import { getAuthFlag } from '../util/flags'
import { readAccountYAML } from '../util/yaml'

export default class Close extends Command {
  static description = 'Closes a proposal'

  static flags = {
    help: flags.help({char: 'h'}),
    auth: getAuthFlag(true)
  }

  static args = [
    {
      name: 'proposal',
      description: 'Hash of the proposal to close',
      required: true
    }
  ]

  async run() {

    const { args, flags } = this.parse(Close)

    const { auth } = flags;

    if (auth === undefined) {
      this.error('Auth file must be specified when submiting a proposal', { exit: -1 });
    }

    const { name, private_key } = readAccountYAML(auth);

    const api = getApi(private_key);

    try {
      let result = await closeProposal(api, name, args.proposal);

      this.log("Proposal closed succesfully", result);
    }
    catch(error) {
      this.error('Error while closing proposal:' + error, { exit: -1 });
    }
  }
}
