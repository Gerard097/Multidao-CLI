import {Command, flags} from '@oclif/command'
import { genPeriods, getApi } from '../eosio/api';
import { getAuthFlag } from '../util/flags';
import { readAccountYAML } from '../util/yaml';

export default class Period extends Command {
  static description = 'Utility actions related to periods'

  static flags = {
    help: flags.help({char: 'h'}),
    period_count: flags.integer({ char: 'c', description: 'Used along "generate", number of periods to generate'}),
    auth: getAuthFlag()
  }

  static args = [
    {
      name: 'dao',
      description: 'Specify the DAO id to which the actions will be applied',
      required: true
    },
    {
      name: 'action',
      description: 'Action to perform. \n- generate: Generates the specified number of periods',
      options: ["generate"]
    },
  ]

  async run() {
    const {args, flags} = this.parse(Period);

    const { action, dao } = args;

    const { period_count, auth } = flags;

    if (action) {
      
      if (action === "generate") {

        if (auth === undefined) {
          this.error('Auth file must be specified when generating periods', { exit: -1 });
        }
        
        if (period_count === undefined) {
          this.error('Must specify number of periods through -c or --period_count', { exit: -1 });
        }

        const { name, private_key } = readAccountYAML(auth);

        const api = getApi(private_key);

        try {
          let result = await genPeriods(api, name, dao, period_count);

          this.log("Generated periods succesfully", result);
        }
        catch(error) {
          this.error('Error while generating periods:' + error, { exit: -1 });
        }
      }
    }
    else {
      this.error('Expected an action to perform, use --help to see how to use this command', { exit: -1 })
    }
  }
}
