export async function createNewUser(token, metadata) {
  const operationsDoc = `
  mutation createNewUser($issuer: String!, $email: String!, $publicAddress: String!) {
    insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
      returning {
        email
        id
        issuer
      }
    }
  }
`;

  const { issuer, email, publicAddress } = metadata;
  const response = await queryHasuraGQL(
    operationsDoc,
    "createNewUser",
    {
      issuer,
      email,
      publicAddress,
    },
    token
  );

  if (response.errors) {
    console.error("Error creating new user:", response.errors);
    throw new Error(response.errors[0].message);
  }

  console.log({ response, issuer });
  return response.data.insert_users.returning[0];
}

export async function isNewUser(token, metadata) {
  const operationsDoc = `
  query isNewUser($issuer: String!, $email: String!) {
    users(where: {_or: [{issuer: {_eq: $issuer}}, {email: {_eq: $email}}]}) {
      id
      email
      issuer
    }
  }
`;

  const { issuer, email } = metadata;
  const response = await queryHasuraGQL(
    operationsDoc,
    "isNewUser",
    {
      issuer,
      email
    },
    token
  );

  console.log({response, issuer, email});
  
  if (response.errors) {
    console.error("Error checking if user is new:", response.errors);
    throw new Error(response.errors[0].message);
  }
  
  return response.data.users.length === 0;
}

async function queryHasuraGQL(operationsDoc, operationName, variables, token) {
    const result = await fetch(process.env.NEXT_PUBLIC_HASURA_ADMIN_URL,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName
      })
    }
  );

  const data = await result.json();

  if (data.errors) {
    console.error("GraphQL error:", data.errors);
    return { errors: data.errors };
  }

  return data;
}