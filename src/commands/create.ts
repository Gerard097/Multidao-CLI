import {Command, flags} from '@oclif/command'
import { runAction } from '../eosio/api'
import { writeFileSync } from 'fs'
import { Params, paramsToYAML, readYAML } from '../util/yaml';

export default class Create extends Command {
  static description = 'Creates a dao'

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-f, --file=VALUE)
    file: flags.string({char: 'f', description: 'Configuration file (yaml)', required: true}),
    generate: flags.boolean({char: 'g', description: 'If specified, creates a template with the required configuration variables for the dao in the file specified with -f'})
  }

  static examples = [
    `$ multidao create -f config.yaml`,
  ]

  // static args = [{name: 'file'}]

  static setupParams: Params = {
    "dao_name": { value: '', desc: 'Name of the DAO (use eosio "name" convention)' },
    "dao_title": { value: '', desc: 'Title of the DAO without limited to 35 characters' },
    "dao_description": { value: '', desc: 'Purpuse of the DAO' },
    "voting_duration_sec": { value: '', desc: 'Voting duration of proposals (in seconds)' } ,
    "peg_token": { value: '', desc: 'Peg token issued for Quests/Assignments/Contributions i.e. 1.00 HUSD' },
    "voice_token": { value: '', desc: 'Voice token issued for Quests/Assignments/Contributions i.e. 1.00 HVOICE' },
    "reward_token": { value: '', desc: 'Reward token issued for Quests/Assignments/Contributions i.e. 1.0000 HYPHA' },
    "reward_to_peg_ratio": { value: '', desc: 'Value of the Reward token in Peg tokens i.e. 1.0000 HYPHA = 8.00 HUSD so the value is set to "8.00 HUSD"' },
    "period_duration_sec": { value: '', desc: 'Duration of each claimable period (in seconds)' },
    "voting_alignment_x100": { value: '', desc: 'Alignment required for proposals to pass' },
    "voting_quorum_x100": { value: '', desc: 'Quorum required for proposals to pass' },
    "onboarder_account": { value: '', desc: 'Account used as the owner of the DAO and onboarder' },
  }

  checkParameters(params: any) {

  }

  async run() {

    const {args, flags} = this.parse(Create)
    
    //Check if we should generate the template file
    if (flags.generate) {
      this.log("Generating configuration file:", flags.file);
      try {
        writeFileSync(flags.file, paramsToYAML(Create.setupParams));
        this.log("File created succesfully");
      }
      catch(err: any) {
        this.error(err);
      }
    }
    //Otherwise we should try to create the DAO
    else {
      const params = readYAML(flags.file);
      this.log(JSON.stringify(params));
    }
  }
}
