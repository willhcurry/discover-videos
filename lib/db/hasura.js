/*
This is an example snippet - you should consider tailoring it
to your service.
*/

async function fetchGraphQL(operationsDoc, operationName, variables) {
  const result = await fetch(
    "https://cosmic-mammoth-48.hasura.app/v1/graphql",
    {
      method: "POST",
      headers: {
        "x-hasura-admin-secret": "5cLVEFdFnn5CwyhVCdbiiF7fI6SDFYcXNdbaCWETKt6BYDKZ7emhIv5fvrHcllbF"
      },
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName
      })
    }
  );

  return await result.json();
}

const operationsDoc = `
  query MyQuery {
    users {
      id
      email
      issuer
      publicAddress
    }
  }
  
  mutation MyMutation {
    insert_users(objects: {id: 1})
  }
`;

function fetchMyQuery() {
  return fetchGraphQL(
    operationsDoc,
    "MyQuery",
    {}
  );
}

function executeMyMutation() {
  return fetchGraphQL(
    operationsDoc,
    "MyMutation",
    {}
  );
}

export async function startFetchMyQuery() {
  const { errors, data } = await fetchMyQuery();

  if (errors) {
    // handle those errors like a pro
    console.error(errors);
  }

  // do something great with this precious data
  console.log(data);
}

startFetchMyQuery();