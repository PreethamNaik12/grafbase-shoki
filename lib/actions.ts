import { ProjectForm } from "../common.types";
import { getUserQuery, createUserMutation, createProjectMutation, projectsQuery, getProjectByIdQuery, getProjectsOfUserQuery, deleteProjectMutation, updateProjectMutation } from "../graphql";
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

  export const uploadImage = async (imagePath: string) => {
    try {
      const response = await fetch(`${serverUrl}/api/upload`, {
        method: "POST",
        body: JSON.stringify({ path: imagePath }),
      })

      return response.json();
    } catch (error) {
      throw error;   
    }
  }
  export const createNewProject = async (form: ProjectForm, creatorid: string, token: string ) => {
    const imageUrl = await uploadImage(form.image);
    //security
    client.setHeader("Authorization", `Bearer ${token}`)

    const variables = {
      input: {
        ...form,
        image: imageUrl.url,
        createdBy: {
          link: creatorid
        }
      }
    }

    if(imageUrl.url) {
      return makeGraphQLRequest(createProjectMutation, variables)
    }
  }


  export const fetchAllProjects = async (category?:string, endcursor?: string  ) => {
    client.setHeader('x-api-key', apiKey);

    return makeGraphQLRequest(projectsQuery, { category, endcursor })
  }

  export const getProjectDetails = (id: string) => {
    client.setHeader('x-api-key', apiKey);
    return makeGraphQLRequest(getProjectByIdQuery, { id })
  }

  export const getUserProjects = (id: string, last?:number) => {
    client.setHeader('x-api-key', apiKey);
    return makeGraphQLRequest(getProjectsOfUserQuery, { id , last})
  }

  export const deleteProject = (id: string, token: string) => {
    client.setHeader("Authorization", `Bearer ${token}`)
    return makeGraphQLRequest(deleteProjectMutation, { id})
  }

  export const editProject = async (form: ProjectForm, ProjectId: string, token: string) => {
    function isBase64DataURL(value: string) {//using  this function we check weather to the image is updated or not
      const base64Regex = /^data:image\/[a-z]+;base64,/;
      return base64Regex.test(value);
    }
  
    let updatedForm = { ...form };
  
    const isUploadingNewImage = isBase64DataURL(form.image);//pass the image URL into the checking function
  
    if (isUploadingNewImage) {//if the image is updated then we upload the image to the server
      const imageUrl = await uploadImage(form.image);
  
      if (imageUrl.url) {
        updatedForm = { ...updatedForm, image: imageUrl.url };
      }
    }

    const variables = {
      id: ProjectId,
      input: updatedForm
    }
  
    client.setHeader("Authorization", `Bearer ${token}`)
    return makeGraphQLRequest(updateProjectMutation, variables)
  }

