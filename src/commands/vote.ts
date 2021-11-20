import {Command, flags} from '@oclif/command'
import { castVote, getApi } from '../eosio/api'
import { getAuthFlag } from '../util/flags'
import { readAccountYAML } from '../util/yaml'

export default class Vote extends Command {
  static description = 'Casts a vote to the specified proposal'

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    auth: getAuthFlag(true),
    notes: flags.string({char: 'n', description: 'Notes added to the vote'})
  }

  static args = [
    {
      name: 'option',
      description: 'Vote option',
      options: ["pass", "abstain", "fail"],
      required: true
    },
    {
      name: 'proposal',
      description: 'Hash of the proposal being voted on',
      required: true
    }
  ]

  async run() {
    const {args, flags} = this.parse(Vote)

    const { auth, notes } = flags;

    const { option, proposal } = args;

    if (auth === undefined) {
      this.error('Auth file must be specified when voting on a proposal', { exit: -1 });
    }

    const { name, private_key } = readAccountYAML(auth);

    try {
      const api = getApi(private_key);

      let result = await castVote(api, name, proposal, option, notes);

      this.log("Vote casted succesfully", result);
    }
    catch(error) {
      this.error('Error while voting on proposal:' + error, { exit: -1 });
    }
  }
}
