import {Command, flags} from '@oclif/command'
import { claimAssignment, getApi } from '../eosio/api'
import { getAuthFlag } from '../util/flags'
import { readAccountYAML } from '../util/yaml'

export default class Assignment extends Command {
  static description = 'Modify/Claim existing assignments'

  static flags = {
    help: flags.help({char: 'h'}),
    auth: getAuthFlag(true)
  }

  static args = [
    {
      name: 'action', 
      description: 'The action to perform on the assignment',
      options: ['claim'],
      required: true
    },
    {
      name: 'assignment', 
      description: 'Hash of the assignment to modify/claim',
      required: true
    }
  ]

  async run() {
    const {args, flags} = this.parse(Assignment)

    const { auth } = flags;

    const { action, assignment } = args;

    if (auth === undefined) {
      this.error('Auth file must be specified when voting on a proposal', { exit: -1 });
    }

    const { name, private_key } = readAccountYAML(auth);

    try {
      const api = getApi(private_key);

      let result;

      switch (action) {
        case 'claim': {
          result = await claimAssignment(api, name, assignment);
          this.log("Period claimed succesfully", result);
        }
        default: 
         throw new Error('Unknown action to perform:' + action);
      }
    }
    catch(error) {
      this.error('Error while executing action on assignment:' + error, { exit: -1 });
    }
  }
}
