import {Command, flags} from '@oclif/command'
import { getDocuments, getDocumentsOfType } from '../eosio/api'

export default class Get extends Command {
  static description = 'Retreives a list of document types'

  static flags = {
    help: flags.help({char: 'h'}),
    // daos: flags.string({ 
    //   char: 'd', 
    //   description: 'Specifies which dao(s) you want to get the Documents from. Defaults to all daos',
    //   multiple: true
    // })
  }

  static args = [
    {
      name: 'type',
      description: "Type of the documents to list",
      options: ['assignment', 'role', 'dao', 'period'],
      required: true
    }
  ]

  async run() {
    const {args, flags} = this.parse(Get)

    // const { daos } = flags;

    const { type } = args;

    // if (daos && type !== 'dao') {
    if (false) {
      //Get documnets only the specified daos
      
    }
    else {
      //Load documents from all daos
      let docs = getDocumentsOfType(type, await getDocuments({ limit: 200 }));

      if (docs.length > 0) {
        docs.forEach((doc, idx) => {
          if (idx === 0) {
            this.log('------------------------------------------------------------------------');
          }
          this.log(doc.getString(["details"]))
          this.log('------------------------------------------------------------------------')
        });
      }
      else {
        this.log("There are no documents of type:", type)
      }
    }
  }
  
}
