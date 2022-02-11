import * as dgraph from "dgraph-js-http"

// Create a client stub.
function newClientStub(url: string) {
  return new dgraph.DgraphClientStub(url);
}

// Create a client.
function newClient(clientStub: dgraph.DgraphClientStub) {
  return new dgraph.DgraphClient(clientStub);
}

let client: dgraph.DgraphClient;

export const changeURL = (url: string) => {
  client = newClient(newClientStub(url));
}

const getQueryByType = (types: string, limit: number, offset: number) => `
  query bytype { 
    docs(func: type(Document), orderdesc: Document.createdDate, first: ${limit ?? 10}, offset: ${offset ?? 0}) @filter(${buildOptionalMultipleFilter("Document.type", types)}) { 
       expand(_all_) {
         hash: Document.hash
       }
    }
  }
`

export const buildOptionalMultipleFilter = (predicate: string, options: string) => {
  let split = options.split(" ");
  
  let filter = "";
  let append = "";
  for (let option of split) {
    filter = filter + append + `eq(${predicate},${option})`;
    append = " or ";
  }

  return filter;
}

const getQueryByTypeAndHash = (limit: number, offset: number, type: string, hash: string) => `
{ 
  docs(func: type(Document), orderdesc: Document.createdDate, first: ${limit ?? 10}, offset: ${offset ?? 0}) @filter(${buildOptionalMultipleFilter("Document.type", type)} or ${buildOptionalMultipleFilter("Document.hash", hash)}) {  
     expand(_all_) {
       hash: Document.hash
     }
  }
}
`
const getQueryByHash = (hash: string, offset: number) => `
{
    docs(func: type(Document), offset: ${offset}) @filter(${buildOptionalMultipleFilter("Document.hash", hash)}) {
      expand(_all_) {
        hash: Document.hash
        contents {
          expand(_all_)
        }
      }
    }
}
`

const getQueryByLabel = (label: string, offset: number) => `
{
  docs(func: type(Document), offset: ${offset}) {
    expand(_all_) {
      hash: Document.hash
      contents {
        expand(_all_)
      }
    }
  }
}
`

const getAllQuery = (limit: number, offset: number) => `
{
    docs(func: type(Document), offset: ${offset}, first: ${limit}) {
      expand(_all_) {
        hash: Document.hash
        contents {
          expand(_all_)
        }
      }
    }
}
`

export const queryByType = async (type: string, limit: number, offset: number) => {
  console.log("types", type, );
  const res = await client.newTxn({ readOnly: true })
                          .query(getQueryByType(type, limit, offset));
  return res;
}

export const queryByHash = async (hash: string, offset: number) => {
  const res = await client.newTxn({ readOnly: true })
                          .query(getQueryByHash(hash, offset));
  return res;
}

export const queryByTypeAndHash = async (type: string, hash: string, limit: number, offset: number) => {
  let query = getQueryByTypeAndHash(limit, offset, type, hash);
  
  const res = await client.newTxn({ readOnly: true })
                          .query(query);
  return res;
}

export const queryAll = async (limit: number, offset: number) => {
  let query = getAllQuery(limit, offset);
  
  const res = await client.newTxn({ readOnly: true })
                          .query(query);
  return res;
}

export const customQuery = async (query: string) => {
  const res = await client.newTxn({ readOnly: true })
                          .query(query);

  return res;
}
