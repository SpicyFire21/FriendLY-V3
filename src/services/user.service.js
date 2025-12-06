// import LocalSource from "@/datasource/controller/user.controller";
import {getRequest, patchRequest, postRequest} from "@/services/axios.service";
// async function getUsersFromLocalSource(){
//     return LocalSource.getUsersController();
// }
async function getUsersFromAPI(){
    return getRequest("/users","GET-USERS");
}
async function getUsersService(){
    let result =null;
    try {
        // result = await getUsersFromLocalSource();
        result = await getUsersFromAPI();


    }catch (e){
        result = {error: 1, status: 404, data: 'erreur rÃ©seau, impossible de rÃ©cupÃ©rer les comptes utilisateurs'  }

    }
    return result.data; //selon la source des données, ajouté ou non .data
}


// async function loginUserFromLocalSource(data){
//     return LocalSource.loginUser(data);
// }

async function loginUserFromAPI(data){


    const login = {
        login:data.pseudo,
        password:data.password,
    }

    return postRequest("/users/login",login,"LOGIN-USER");
}


async function loginUser(data){
    let response = null;

    try {
        // response = await loginUserFromLocalSource(data);
        response = await loginUserFromAPI(data);
    }
    catch(err) {
        console.error(err," ",response)
        response = {error: 1, status: 404, data: 'erreur rÃ©seau, impossible de se loguer'  }
    }
    return response
}

async function registerUserFromAPI(data){

    const dataAPI = {
        ...data,
        realname:'',
        bio:''
    }
    console.log(dataAPI)
    // const config = {headers: { "Content-Type": "multipart/form-data" }}
    return postRequest("/users/register",dataAPI,"REGISTER-USER");
}

async function registerUserService(data){
    let response = null;
    try {

        response = await registerUserFromAPI(data);
    }
    catch(err) {
        console.error(err)
        response = {error: 1, status: 404, data: 'erreur rÃ©seau, impossible de créer son compte'  }
    }
    return response.data
}

async function getFollowersByUserIDFromAPI(id){
    return getRequest(`/users/${id}/followers`,"GET-FOLLOWERS-BY-USER-ID")
}
async function getFollowersByUserID(id){
    let response = null;
    try {

        response = await getFollowersByUserIDFromAPI(id);
    }
    catch(err) {
        console.error(err)
        response = {error: 1, status: 404, data: 'erreur rÃ©seau, impossible de récupérer les followers de l\'utilisateur'  }
    }
    return response.data
}


async function getSubscribersByUserIDFromAPI(id){
    return getRequest(`/users/${id}/subscribes`,"GET-SUBSCRIBERS-BY-USER-ID")
}
async function getSubscribersByUserID(id){
    let response = null;
    try {

        response = await getSubscribersByUserIDFromAPI(id);
    }
    catch(err) {
        console.error(err)
        response = {error: 1, status: 404, data: 'erreur rÃ©seau, impossible de récupérer les subscribers de l\'utilisateur'  }
    }
    return response.data
}



async function updateUserFromAPI(data){


    const id = data.get('id');
    const config = {headers: { 'Content-Type': 'multipart/form-data' }}

    console.log(data)
    return patchRequest(`/users/profil/${id}`,data,"EDIT-USER",config)
}
async function updateUser(data){
    let response = null;
    try {
        response = await updateUserFromAPI(data);

    }
    catch(err) {
        console.error(err)
        response = {error: 1, status: 404, data: 'erreur rÃ©seau, impossible de modifier l\'utilisateur'  }
    }
    return response.data
}


async function addFollowerFromAPI(data){
    return postRequest(`/users/follow`,data,"ADD-FOLLOWER")
}
async function addFollower(data){
    let response = null;
    try {

        response = await addFollowerFromAPI(data);
    }
    catch(err) {
        console.error(err)
        response = {error: 1, status: 404, data: 'erreur rÃ©seau, impossible d\'ajouter le follower'  }
    }
    return response.data
}


export default {
    getUsersService,
    loginUser,
    registerUserService,
    getFollowersByUserID,
    getSubscribersByUserID,
    updateUser,
    addFollower
}
