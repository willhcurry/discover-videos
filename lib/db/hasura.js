const operationsDoc1 = `
  mutation insertStats($favorited: Int!, $userId: 
  String!, $watched: Boolean!, $videoId: String!) {
    insert_stats_one(object: {favorited: $favorited, 
    userId: $userId, watched: $watched, videoId: $videoId}
    ) {
      favorited
      id
      userId
    }
  }
`;

export async function updateStats(
  token,
  { favorited, userId, watched, videoId }
) {
  const operationsDoc = `
  mutation updateStats($favorited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
    update_stats(
      _set: {watched: $watched, favorited: $favorited}, 
      where: {
        userId: {_eq: $userId}, 
        videoId: {_eq: $videoId}
      }) {
      returning {
        favorited,
        userId,
        watched,
        videoId
      }
    }
  }
`;

  return await queryHasuraGQL(
    operationsDoc,
    "updateStats",
    { favorited, userId, watched, videoId },
    token
  );
}



export async function findVideoIdByUser(token, userId, videoId) {
  const operationsDoc = `
  query findVideoIdByUserId($userId: String!, videoId: String!) {
    stats(where: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}) {
      id
      userId
      videoId
      favorited
      watched
    }
  }
`;

const response = await queryHasuraGQL(
    operationsDoc,
    "findVideoIdByUserId",
    {
      videoId,
      userId,
    },
    token
  );

  return response?.data?.stats?.length > 0;
}


// Export a function to create a new user
export async function createNewUser(token, metadata) {
  // Define the GraphQL mutation to create a new user
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

  // Destructure metadata into issuer, email, and publicAddress
  const { issuer, email, publicAddress } = metadata;

  // Log the metadata for debugging purposes
  console.log("Creating new user with metadata:", metadata);

  // Call the queryHasuraGQL function to execute the mutation
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

  // Return the response
  return response;
}

// Export a function to check if a user is new
export async function isNewUser(token, issuer) {
  // Define the GraphQL query to check if a user exists
  const operationsDoc = `
    query isNewUser($issuer: String!) {
      users(where: {issuer: {_eq: $issuer}}) {
        id
        email
        issuer
      }
    }
  `;

  // Call the queryHasuraGQL function to execute the query
  const response = await queryHasuraGQL(
    operationsDoc,
    "isNewUser",
    {
      issuer,
    },
    token
  );

  // Log the response and issuer for debugging purposes
  console.log({ response, issuer });

  // Return true if the user is new (i.e., no users found), false otherwise
  return response?.data?.users?.length === 0;
}

// Define a helper function to query the Hasura GraphQL API
async function queryHasuraGQL(operationsDoc, operationName, variables, token) {
  // Define the fetch options
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  };

  // Fetch the Hasura GraphQL API
  const result = await fetch(process.env.NEXT_PUBLIC_HASURA_ADMIN_URL, options);

  // Return the JSON response
  return await result.json();
}