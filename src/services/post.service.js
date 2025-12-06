// import LocalSource from "@/datasource/controller/post.controller";
// async function getPostsFromLocalSource(){
//     return LocalSource.getPostsController();
// }
import {deleteRequest, getRequest, postRequest} from "@/services/axios.service";
async function getPostsFromAPI(){
    return getRequest("/posts","GET-POSTS");
}

async function getPostsService(){
    let result =null;
    try {
        // result = await getPostsFromLocalSource();
        result = await getPostsFromAPI();

    }catch (e){
        result = {error: 1, status: 404, data: 'erreur rÃ©seau, impossible de rÃ©cupÃ©rer les publications'  }

    }
    return result.data;
}



async function getLovesFromAPI(){
    return getRequest(`/posts/loves/`,"GET-LOVES")
}

async function getLoves(){
    let result =null;
    try {
        result = await getLovesFromAPI();

    }catch (e){
        result = {error: 1, status: 404, data: 'erreur rÃ©seau, impossible de rÃ©cupÃ©rer les loves'  }
    }
    return result.data;
}




async function getLikesFromAPI(){
    return getRequest(`/posts/likes/`,"GET-LIKES")
}

async function getLikes(){
    let result =null;
    try {
        result = await getLikesFromAPI();

    }catch (e){
        result = {error: 1, status: 404, data: 'erreur rÃ©seau, impossible de rÃ©cupÃ©rer les likes'  }
    }
    return result.data;
}



async function addLoveFromAPI(data){
    return postRequest(`/posts/love/`,data,"ADD-LOVES")
}

async function addLove(data){
    let result =null;
    try {
        result = await addLoveFromAPI(data);

    }catch (e){
        result = {error: 1, status: 404, data: 'erreur rÃ©seau, impossible d\'ajouter un love'  }
    }
    return result.data;
}

async function addLikeFromAPI(data){
    return postRequest(`/posts/like/`,data,"ADD-LIKES")
}

async function addLike(data){
    let result =null;
    try {
        result = await addLikeFromAPI(data);

    }catch (e){
        result = {error: 1, status: 404, data: 'erreur rÃ©seau, impossible d\'ajouter un like'  }
    }
    return result.data;
}








async function removeLoveFromAPI(idpost,iduser){
    return deleteRequest(`/posts/unlove/${idpost}/${iduser}`,"REMOVE-LOVES")
}

async function removeLove(data){
    let result =null;
    try {
        result = await removeLoveFromAPI(data.idpost,data.iduser);

    }catch (e){
        result = {error: 1, status: 404, data: 'erreur rÃ©seau, impossible de supprimer un love'  }
    }
    return result.data;
}

async function removeLikeFromAPI(idpost,iduser){
    return deleteRequest(`/posts/unlike/${idpost}/${iduser}`,"REMOVE-LIKES")
}

async function removeLike(data){
    let result =null;
    try {
        result = await removeLikeFromAPI(data.idpost,data.iduser);

    }catch (e){
        result = {error: 1, status: 404, data: 'erreur rÃ©seau, impossible de supprimer un like'  }
    }
    return result.data;
}



async function sendPostFromAPI(data){
    console.log(data)
    const config = {headers: { 'Content-Type': 'multipart/form-data' }}

    return postRequest("/posts/send",data,"SEND-POST",config)
}

async function sendPost(data) {
    let result = null;
    try {
        result = await sendPostFromAPI(data);

    } catch (e) {
        result = {error: 1, status: 404, data: 'erreur rÃ©seau, impossible de supprimer un like'}
    }
    return result.data;
}


    export default {
    getPostsService,
    getLoves,
    getLikes,
    addLove,
    addLike,
    removeLike,
    removeLove,
    sendPost
}