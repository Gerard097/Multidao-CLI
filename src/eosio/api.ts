import { Params } from "../util/yaml";
import { DGDocument } from "./document";

const fs = require('fs');
const fetch = require('cross-fetch');
const { TextDecoder, TextEncoder } = require('util');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');
const { Api, JsonRpc } = require('eosjs')

const eosEndpoint = 'https://testnet.telos.caleos.io'

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
    code: 'mtdhoxhyphaa',      // Contract that we target
    scope: 'mtdhoxhyphaa',         // Account that owns the data
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
      code: 'mtdhoxhyphaa',      // Contract that we target
      scope: 'mtdhoxhyphaa',         // Account that owns the data
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

  return [[
    getItem('content_group_label', 'details', Types.String),
    ...Object.entries(params)
          .map(([key, param]) => getItem(key, param.value, param.type))
  ]]
}

export const runAction = (api: any, action: string, account: string, data: any) => {

  return api.transact({
    actions: [{
      account: 'mtdhoxhyphaa',
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
      account: 'mtdhoxhyphaa',
      name: action,
      authorization: [],
      data: data,
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
}

export const genPeriods = (api: any, issuer: string, dao_hash: string, period_count: number) => {
  return runAction(api, 'genperiods', issuer, {
    dao_hash,
    period_count
  })
}

export const claimAssignment = (api: any, claimer: string, assignment_hash: string) => {
  return runAction(api, 'claimnextper', claimer, { assignment_hash });
}

export const closeProposal = (api: any, closer: string, proposal_hash: string) => {
  return runAction(api, 'closedocprop', closer, { proposal_hash })
}

export const createDAO = (api: any, account: string, config: Params) => {
  return runAction(api, 'createdao', account, {
    config: buildContentGroups(config)
  })
}

export const createProposal = (api: any, 
                               dao_hash: string, 
                               proposer: string,
                               proposal_type: string,
                               proposal_info: Params) => {
  return runAction(api, 'propose', proposer, {
    dao_hash,
    proposer,
    proposal_type,
    content_groups: buildContentGroups(proposal_info)
  });
}

export const castVote = (api: any, voter: string, proposal_hash: string, vote: string, notes?: string) => {
  return runAction(api, 'vote', voter, {
    voter,
    proposal_hash,
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