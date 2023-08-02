import { getUserQuery, createUserMutation } from "../graphql";
import { GraphQLClient } from "graphql-request";

const isProduction = process.env.NODE_ENV === "production";
const apiUrl = isProduction ?process.env.NEXT_PUBLIC_GRAFBASE_API_URL || '' : 'http://127.0.0.1:4000/graphql';
const apiKey = isProduction ? process.env.GRAFBASE_API_KEY || '' : 'letmein';
const serverUrl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL || '' : 'http://localhost:3000';



const client = new GraphQLClient(apiUrl);

export const fetchToken = async () => {
  try {
    const response = await fetch(`${serverUrl}/api/auth/token`);
    return response.json();
  } catch (err) {
    throw err;
  }
};

export const getUser = async (email: string) => {
    client.setHeader('x-api-key', apiKey);
    return makeGraphQLRequest(getUserQuery, { email })
};

export const createUser = async (name: string, email: string, avatarUrl: string) => {
    client.setHeader('x-api-key', apiKey);
    
    const vaiables = { 
        input: {
            name: name,
            email:  email, 
            avatarUrl: avatarUrl 
        },
    };
    return makeGraphQLRequest(createUserMutation, vaiables);
};

const makeGraphQLRequest = async (query: string, variables = {}) => {
    try {
      return await client.request(query, variables);
    } catch (err) {
      throw err;
    }
  };