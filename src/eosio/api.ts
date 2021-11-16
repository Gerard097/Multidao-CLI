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
    JsSignatureProvider: getSignatureProvider(key),
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
});
}

const Types = {
  Int: 'int64',
  String: 'string',
  Checksum: 'checksum256',
  Asset: 'asset',
  Name: 'name',
  TimePoint: 'time_point',
} 

const getItem = (label: string, value: any, type=Types.String) => (
  {
    "label": label,
    "value": [
        type,
        value
    ]
  }
)

export const runAction = async (api: any, action: string, account: string, data: any) => {

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
//         name: 'closedocpro',
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