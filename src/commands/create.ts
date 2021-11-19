import {Command, flags} from '@oclif/command'
import { createDAO, getApi, Types } from '../eosio/api'
import { writeFileSync } from 'fs'
import { Params, paramsToYAML, readAccountYAML, readYAML } from '../util/yaml';
import { getAuthFlag } from '../util/flags';

export default class Create extends Command {
  static description = 'Creates a dao'

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-f, --file=VALUE)
    
    generate: flags.boolean({ 
      char: 'g', 
      description: 'If specified, creates a template with the required configuration variables for the dao in the specified file'
    }),
    auth: getAuthFlag()
  }

  static args = [
    {
      name: 'file',
      description: 'File containing the DAO configuration variables or where the template will be generated if -g is specified (YAML)', 
      required: true
    }
  ]

  static examples = [
    `$ multidao create -f config.yaml`,
  ]

  // static args = [{name: 'file'}]

  static setupParams: Params = {
    "dao_name": { 
      value: '', 
      desc: 'Name of the DAO (use eosio "name" convention)', 
      type: Types.Name 
    },
    "dao_title": { 
      value: '', 
      desc: 'Title of the DAO without limited to 35 characters', 
      type: Types.String 
    },
    "dao_description": { 
      value: '', 
      desc: 'Purpuse of the DAO', 
      type: Types.String 
    },
    "voting_duration_sec": { 
      value: '', 
      desc: 'Voting duration of proposals (in seconds)', 
      type: Types.Int 
    } ,
    "peg_token": { 
      value: '', 
      desc: 'Peg token issued for Quests/Assignments/Contributions i.e. 1.00 HUSD', 
      type: Types.Asset 
    },
    "voice_token": { 
      value: '', 
      desc: 'Voice token issued for Quests/Assignments/Contributions i.e. 1.00 HVOICE',
      type: Types.Asset
    },
    "reward_token": { 
      value: '', 
      desc: 'Reward token issued for Quests/Assignments/Contributions i.e. 1.0000 HYPHA',
      type: Types.Asset
    },
    "reward_to_peg_ratio": { 
      value: '', 
      desc: 'Value of the Reward token in Peg tokens i.e. 1.0000 HYPHA = 8.00 HUSD so the value is set to "8.00 HUSD"',
      type: Types.Asset
    },
    "period_duration_sec": { 
      value: '', 
      desc: 'Duration of each claimable period (in seconds)',
      type: Types.Int
    },
    "voting_alignment_x100": { 
      value: '', 
      desc: 'Alignment required for proposals to pass',
      type: Types.Int
    },
    "voting_quorum_x100": {
      value: '', 
      desc: 'Quorum required for proposals to pass',
      type: Types.Int
    },
    "onboarder_account": { 
      value: '', 
      desc: 'Account used as the owner of the DAO and onboarder',
      type: Types.Name
    },
  }

  checkParameters(params: any) {

  }

  async run() {

    const {args, flags} = this.parse(Create);

    const { file } = args;

    const { auth } = flags;
    
    //Check if we should generate the template file
    if (flags.generate) {
      this.log("Generating configuration file:", file);
      try {
        writeFileSync(file, paramsToYAML(Create.setupParams));
        this.log("File created succesfully");
      }
      catch(err: any) {
        this.error(err);
      }
    }
    //Otherwise we should try to create the DAO
    else {

      if (auth === undefined) {
        this.error('Auth file must be specified when submiting a proposal', { exit: -1 });
      }

      const [params, missing] = readYAML(file, Create.setupParams);
      
      if (missing.length !== 0) {
        this.error('Missing required dao configuration variables:' + 
                   missing.reduce((p, item) => p + "\n- " + item, ""), { exit: -1 });
      }

      const { name, private_key } = readAccountYAML(auth);

      const api = getApi(private_key);

      try {
        let result = await createDAO(api, name, params);

        this.log("DAO Created succesfully", result);
      }
      catch(error) {
        this.error('Error while creating DAO:' + error, { exit: -1 });
      }
      
    }
  }
}
