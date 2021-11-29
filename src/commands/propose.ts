import {Command, flags} from '@oclif/command'
import { writeFileSync } from 'fs'
import { buildContentGroups, createProposal, getApi, Types } from '../eosio/api'
import { getAuthFlag } from '../util/flags'
import { Params, paramsToYAML, readAccountYAML, readYAML } from '../util/yaml'

export default class Propose extends Command {
  static description = 'Creates a proposal document for an specific dao'

  static flags = {
    help: flags.help({
      char: 'h'
    }),
    generate: flags.boolean({
      char: 'g', 
      default: false, 
      description: 'If specified, creates a template with the required parameters for the proposal type in the specified file'
    }),
    auth: getAuthFlag()
  }

  static args = [
    {
      name: 'type',
      required: true,
      description: 'Proposal type',
      options: ['assignment', 'role', 'contribution']
    },
    {
      name: 'file',
      required: true,
      description: 'File containing the proposal information or where the template will be generated if -g is specified'
    },
    {
      name: 'dao',
      required: false,
      description: 'Hash of the DAO where the proposal will be created',
    },
  ]

  static examples = [
    `$ multidao propose -f assignment.yaml -a generate`,
    `$ multidao propose hypha -f assignment.yaml -a`,
  ]
  
  static generateParams: { [key:string]: Params } = {
    assignment: {
      title: { 
        desc: 'Title of the assignment', 
        value: '',
        type: Types.String
      },
      description: { 
        desc: 'Description of the assignment', 
        value: '',
        type: Types.String
      },
      assignee: { 
        desc: 'Account resposible of the assignment (must be a member of the DAO) ', 
        value: '',
        type: Types.Name
      },
      role: { 
        desc: 'Hash of the base archetype of the assingment (hash)', 
        value: '',
        type: Types.Checksum
      },
      start_period: { 
        desc: 'First claimable period of the assignmet (hash). Leave blank to use the current period', 
        value: '',
        type: Types.Checksum,
        optional: true
      },
      period_count: { 
        desc: 'Number of claimable periods this assignment is valid for', 
        value: '',
        type: Types.Int
      },
      time_share_x100: { 
        desc: 'Percentage of commitment for the assignment [0-100]', 
        value: '',
        type: Types.Int
      },
      deferred_perc_x100: {
        desc: 'Deferred percentage [0-100]', 
        value: '',
        type: Types.Int
      }
    },
    role: { 
      title: { 
        desc: 'Title of the role', 
        value: '',
        type: Types.String
      },
      description: { 
        desc: 'Description of the role', 
        value: '',
        type: Types.String
      },
      min_deferred_x100: { 
        desc: 'Minimum deferred percentage required when applying to this role (role assignment) [0-100]', 
        value: '',
        type: Types.Int
      },
      min_time_share_x100: {
        desc: 'Minimum commitment percentage required when applying to this role (role assignment) [0-100]',
        value: '',
        type: Types.Int
      },
      annual_usd_salary: {
        desc: 'Annual salary equivalent in USD i.e. 80000.00 USD',
        value: '',
        type: Types.Asset
      }
    },
    contribution: { 
      
    },
  }

  checkParameters(type: ['assignment', 'role', 'contribution'], params: any) {
    
    //TODO: Iterate all parameters and check if any is missing and mark it.

    return false;
  }

  async run() {
    const { args, flags } = this.parse(Propose)

    const { type, file, dao } = args;

    const { auth } = flags;

    //Check if we should generate the template file
    if (flags.generate) {
      this.log("Generating proposal file:", file);
      try {
        writeFileSync(file, paramsToYAML(Propose.generateParams[type]));
        this.log("File created succesfully");
      }
      catch(err: any) {
        this.error(err);
      }
    }
    //Otherwise we should try to create the DAO
    else {

      if (dao === undefined) {
        this.error('DAO must be specified when submiting a proposal', { exit: -1 });
      }

      if (auth === undefined) {
        this.error('Auth file must be specified when submiting a proposal', { exit: -1 });
      }

      const [params, missing] = readYAML(file, Propose.generateParams[type]);

      if (missing.length !== 0) {
        this.error('Missing required proposal parameters:' + 
                   missing.reduce((p, item) => p + "\n- " + item, ""), { exit: -1 });
      }

      const { name, private_key } = readAccountYAML(auth);

      const api = getApi(private_key);

      try {
        let result = await createProposal(api, dao, name, type, params);

        this.log("Proposal Created succesfully", result);
      }
      catch(error) {
        this.error('Error while creating proposal:' + error, { exit: -1 });
      }
    }
  }
}
