import { Params } from "../util/yaml";
import { DGDocument } from "./document";

import 'dotenv/config' 

const fs = require('fs');
const fetch = require('cross-fetch');
const { TextDecoder, TextEncoder } = require('util');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');
const { Api, JsonRpc } = require('eosjs')

let eosEndpoint = process.env.EOSIO_ENDPOINT

let contract = process.env.EOSIO_CONTRACT;

function getSignatureProvider (key: string) { return new JsSignatureProvider([key]) };

const rpc = new JsonRpc(
  eosEndpoint, { fetch }
);

export function getApi(key: string) { 
return new Api({
    rpc,
    signatureProvider: getSignatureProvider(key),
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
});
}

export const Types = {
  Int: 'int64',
  String: 'string',
  Checksum: 'checksum256',
  Asset: 'asset',
  Name: 'name',
  TimePoint: 'time_point',
  Array: "array",
  Group: "group"
}

export const getItem = (label: string, value: any, type=Types.String) => (
  {
    "label": label,
    "value": [
        type,
        value
    ]
  }
)

export const getEdgesFromWithName = async () => {
  let edges = [];

  await rpc.get_table_rows({
    json: true,               // Get the response as json
    code: contract,      // Contract that we target
    scope: contract,         // Account that owns the data
    table: 'edges',        // Table name
    limit: 100,                // Maximum number of rows that we want to get
    reverse: false,           // Optional: Get reversed data
    show_payer: false,          // Optional: Show ram payer 
  });
}

export const getDocuments = async ({ limit } = { limit: 100 }): Promise<any[]> => {

  let readDocs: any[] = [];

  let moreDocs = true;
  let nextKey: any = undefined;

  while(moreDocs && (limit === -1 || readDocs.length < limit)) {

    const { rows, more, next_key } = await rpc.get_table_rows({
      json: true,               // Get the response as json
      code: contract,      // Contract that we target
      scope: contract,         // Account that owns the data
      table: 'documents',        // Table name
      limit: 100,                // Maximum number of rows that we want to get
      reverse: false,           // Optional: Get reversed data
      show_payer: false,          // Optional: Show ram payer
      lower_bound: nextKey 
    });

    nextKey = next_key;

    moreDocs = more;

    let remaining = limit - readDocs.length;

    if (limit !== -1 && rows.length > remaining) {
      rows.length = remaining;
    }
    
    readDocs = readDocs.concat(rows);
  }

  return readDocs;
}

type DocumentTypes = "assignment" | "dao" | "role" | "settings";

export const getDocumentsOfType = (type: DocumentTypes, documents: any[]) => {
  return documents.map((d) => new DGDocument(d))
                  .filter((doc: DGDocument) => doc.getDocumentType() === type)
}

export const buildContentGroups = (params: Params) => {

  let plainDataKeys = Object.keys(params);
  let otherGroups: string[] = [];
  plainDataKeys = plainDataKeys.filter(key => {
    if (typeof params[key].value === "object") {
      otherGroups.push(key);
      return false;
    }
    else {
      return true;
    }
  });
  
  return [[
    getItem('content_group_label', 'details', Types.String),
    // ...Object.entries(params)
    //       .map(([key, param]) => getItem(key, param.value, param.type))
    ...plainDataKeys.map(key => getItem(key, params[key].value, params[key].type))
  ],
  //Pseudo-hardcoded to work with unknonw elements in advance from any group
  ...otherGroups.map(key => {
    let iMap: { [key: string]: { value: any, type: string } } = params[key].value;
    return [
    getItem('content_group_label', key, Types.String),
    ...Object.entries(iMap)
          .map(([key, param]) =>  getItem(key, param.value, param.type))
    ]
  })]
}

export const runAction = (api: any, action: string, account: string, data: any) => {

  return api.transact({
    actions: [{
      account: contract,
      name: action,
      authorization: [{
        actor: account,
        permission: 'active',
      }],
      data: data,
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
}

export const runActionUnauth = (api: any, action: string, data: any) => {

  return api.transact({
    actions: [{
      account: contract,
      name: action,
      authorization: [],
      data: data,
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
}

export const genPeriods = (api: any, issuer: string, dao_id: string, period_count: number) => {
  return runAction(api, 'genperiods', issuer, {
    dao_id,
    period_count
  })
}

export const claimAssignment = (api: any, claimer: string, assignment_hash: string) => {
  return runAction(api, 'claimnextper', claimer, { assignment_hash });
}

export const adjustDeferral = (api: any, issuer: string, assignment_hash: string, new_deferred_perc_x100: number) => {
  return runAction(api, 'adjustdeferr', issuer, { issuer, assignment_hash, new_deferred_perc_x100 });
}



export const closeProposal = (api: any, closer: string, proposal_id: string) => {
  return runAction(api, 'closedocprop', closer, { proposal_id })
}

export const createDAO = (api: any, account: string, config: Params) => {  

  console.log(JSON.stringify(buildContentGroups(config), undefined, 4));
  

  return runAction(api, 'createdao', account, {
    config: buildContentGroups(config)
  })
}

export const createProposal = (api: any, 
                               dao_id: string, 
                               proposer: string,
                               proposal_type: string,
                               proposal_info: Params) => {
  return runAction(api, 'propose', proposer, {
    dao_id,
    proposer,
    proposal_type,
    content_groups: buildContentGroups(proposal_info),
    publish: true
  });
}

export const castVote = (api: any, voter: string, proposal_id: string, vote: string, notes?: string) => {
  return runAction(api, 'vote', voter, {
    voter,
    proposal_id,
    vote,
    notes: notes ?? " "
  })
}

// import { Link } from 'anchor-link'
// import { ConsoleTransport } from 'anchor-link-console-transport'

// const transport = new ConsoleTransport()
// const link = new Link({
//     transport,
//     chains: [
//         {
//             chainId: '1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f',
//             nodeUrl: 'https://testnet.telos.caleos.io',
//         }
//     ],
// })

// export const runAction = () => {

//     const action = {
//         account: 'mtdhoxhyphaa',
//         name: 'closedocprop',
//         authorization: [
//             {
//                 actor: '............1', // ............1 will be resolved to the signing accounts name
//                 permission: '............2', // ............2 will be resolved to the signing accounts authority (e.g. 'active')
//             },
//         ],
//         data: {
//             proposal_hash: 'c14638620817e463edf36f85ce329adc7f181a5bdacda34e2884813d9cb00d54'
//         },
//     };

//     link.transact({action}).then(({signer, transaction} : { signer: any, transaction: any }) => {
//         console.log(
//             `Success! Transaction signed by ${signer} and bradcast with transaction id: ${transaction.id}`
//         )
//     })
// }
