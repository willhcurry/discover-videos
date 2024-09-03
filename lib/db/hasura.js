export async function queryHasuraGQL(operationsDoc, operationName, variables) {
    const result = await fetch(process.env.NEXT_PUBLIC_HASURA_ADMIN_URL,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik5PVFdpbGxpYW0iLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNzI1MjQwNjc5LCJleHAiOjE3MjU4NDU1MTYsImh0dHBzOi8vaGFzdXJhLmlvL2p3dC9jbGFpbXMiOnsieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoidXNlciIsIngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsidXNlciIsImFkbWluIl0sIngtaGFzdXJhLXVzZXItaWQiOiJOT1RXaWxsaWFtIn19.qbNj2jqEei-OwwTu3m2lTeN9JthZ9EFS9fXQ2thkoXo",
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


function fetchMyQuery() {
  const operationsDoc = `
    query MyQuery {
      users {
        email
        id
        issuer
        publicAddress
      }
    }
  `;
  return queryHasuraGQL(operationsDoc, "MyQuery", {});
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