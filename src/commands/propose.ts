import {Command, flags} from '@oclif/command'
import { writeFileSync } from 'fs'
import { paramsToYAML, readYAML } from '../util/yaml'

export default class Propose extends Command {
  static description = 'Creates a proposal document for an specific dao'

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    file: flags.string({char: 'f', description: 'Proposal information', required: true}),
    generate: flags.boolean({char: 'g', description: 'If specified, creates a template with the required parameters for the proposal type in the file specified with -f'})
  }

  static args = [
    {
      name: 'type',
      required: true,
      description: 'Proposal type',
      options: ['assignment', 'role', 'contribution']
    },
  ]

  static examples = [
    `$ multidao propose -f assignment.yaml -a generate`,
    `$ multidao propose -f assignment.yaml -a submit`,
  ]
  
  static generateParams = {
    assignment: ["title", "description", "role"],
    role: ["title", "description"],
    contribution: ["title", "description"]
  }

  checkParameters(type: ['assignment', 'role', 'contribution'], params: any) {
    
    //TODO: Iterate all parameters and check if any is missing and mark it.

    return false;
  }

  async run() {
    const {args, flags} = this.parse(Propose)

    //Check if we should generate the template file
    if (flags.generate) {
      this.log("Generating proposal file:", flags.file);
      try {
        //writeFileSync(flags.file, paramsToYAML(Propose.));
        this.log("File created succesfully");
      }
      catch(err: any) {
        this.error(err);
      }
    }
    //Otherwise we should try to create the DAO
    else {
      const params = readYAML(flags.file);
      //this.log(JSON.stringify(params));
    }
  }
}
