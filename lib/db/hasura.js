// Function to insert new stats into the database
export async function insertStats(token, { favorited, userId, watched, videoId }) {
  const operationsDoc = `
    mutation insertStats($favorited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
      insert_stats_one(object: {
        favorited: $favorited, 
        userId: $userId,
        watched: $watched, 
        videoId: $videoId
      }) {
        favorited
        userId
      }
    }
  `;

  // Call the Hasura GraphQL query function with the mutation document
  return await queryHasuraGQL(
    operationsDoc,
    "insertStats",
    { favorited, userId, watched, videoId },
    token
  );
}

// Function to update existing stats in the database
export async function updateStats(token, { favorited, userId, watched, videoId }) {
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

  // Call the Hasura GraphQL query function with the mutation document
  return await queryHasuraGQL(
    operationsDoc,
    "updateStats",
    { favorited, userId, watched, videoId },
    token
  );
}

// Function to check if stats already exist for a given user and video
export async function findVideoIdByUser(token, userId, videoId) {
  const operationsDoc = `
    query findVideoIdByUserId($userId: String!, $videoId: String!) {
      stats(where: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}) {
        id
        userId
        videoId
        favorited
        watched
      }
    }
  `;

  // Execute the query to find stats
  const response = await queryHasuraGQL(
    operationsDoc,
    "findVideoIdByUserId",
    { videoId, userId },
    token
  );

  // Return true if stats exist, false otherwise
  return response?.data?.stats?.length > 0;
}

// Function to create a new user in the database
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

  // Destructure metadata to extract user details
  const { issuer, email, publicAddress } = metadata;

  // Log the metadata for debugging
  console.log("Creating new user with metadata:", metadata);

  // Call the Hasura GraphQL query function to insert the new user
  const response = await queryHasuraGQL(
    operationsDoc,
    "createNewUser",
    { issuer, email, publicAddress },
    token
  );

  // Return the response from Hasura
  return response;
}

// Function to check if the user is new
export async function isNewUser(token, issuer) {
  const operationsDoc = `
    query isNewUser($issuer: String!) {
      users(where: {issuer: {_eq: $issuer}}) {
        id
        email
        issuer
      }
    }
  `;

  // Query the database to check if the user already exists
  const response = await queryHasuraGQL(
    operationsDoc,
    "isNewUser",
    { issuer },
    token
  );

  // Log the response for debugging
  console.log({ response, issuer });

  // Return true if no users were found, false if the user already exists
  return response?.data?.users?.length === 0;
}

// Helper function to interact with the Hasura GraphQL API
async function queryHasuraGQL(operationsDoc, operationName, variables, token) {
  // Configure the request options for the GraphQL API
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // Pass the authorization token
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      query: operationsDoc, // GraphQL query or mutation
      variables: variables, // Variables for the query
      operationName: operationName, // Name of the operation
    }),
  };

  // Execute the fetch request to Hasura's GraphQL API
  const result = await fetch(process.env.NEXT_PUBLIC_HASURA_ADMIN_URL, options);

  // Parse and return the JSON response
  return await result.json();
}
