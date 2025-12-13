import PostsService from '@/services/post.service';
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePostStore = defineStore('posts',() =>{
    // state
    const posts = ref([])
    const loves = ref([])
    const likes = ref([])
    const saves = ref([])
    const followerPosts = ref([])
    const showDialog = ref(false)

    // getter
    const getCountLoves = (postId) => loves.value.filter(love => love.idpost === postId).length;
    const getCountLikes = (postId) => likes.value.filter(love => love.idpost === postId).length;
    const getCountSaves = (postId) => saves.value.filter(love => love.idpost === postId).length;
    const getCountPostsByUser = (userId) => {
        const count = posts.value.filter((p) => p.authorid === userId).length;
        return count === undefined ? "ERROR-COUNT_OF_POST-NOT-FOUND" : count;
    }
    const getPostsByUser = (userId) => posts.value.filter((p) => p.authorid === userId);

    //mutation
    const updatePosts = (data) => {
        posts.value=data
    }
    const addPost = (data) =>{
        posts.value.push(data)
    }
    const setLikes = (data) => {
        likes.value = data;
    }
    const setLoves =  (data) => {
        loves.value = data;
    }
    const addLove = (data) => {
        loves.value.push(data)
    }
    const addLike = (data) => {
        likes.value.push(data)
    }
    const removeLove = (data) => {
        loves.value = loves.value.filter(
            love => !(love.idpost === data.idpost && love.iduser === data.iduser)
        );

    }
    const removeLike = (data) =>{
        likes.value = likes.value.filter(
            like => !(like.idpost === data.idpost && like.iduser === data.iduser)
        );

    }
    const updateShowDialog = (data) =>{
        showDialog.value = data
    }

    //action
    const getPostsToStore = async () => {
        try {
            let result = await PostsService.getPostsService();
            if (result.error === 0) {
                updatePosts(result.data);

            } else {
                console.error(result.data);
            }

        } catch (e) {
            console.error("Erreur lors de la récupération des publications", e)
        }
    }

    const sendPost = async (data) =>{
        try {
            let result = await PostsService.sendPost(data);
            if (result.error === 0) {
                addPost(result.data);
            } else {
                console.error(result.data);
            }
        } catch (e) {
            console.error("Erreur lors de l'envoie de la publication", e)

        }
    }

    const getLoves = async () =>{
        try {
            let response = await PostsService.getLoves();
            if(response.error ===0){
                setLoves(response.data);
            }
            response.data
        }catch (error) {
            console.error(error);
            return {error: 1, data: "Erreur lors de la récupération des loves"};
        }
    }
    const addLoveAction = async (data) => {
        try {
            let response = await PostsService.addLove(data);

            if(response.error ===0){
                addLove(response.data);
            }
            response.data
        }catch (e) {
            console.error(e)
            return {error: 1, data: "Erreur lors de l'ajout du love"};

        }
    }
    const removeLoveAction = async (data) => {
        try {
            let response = await PostsService.removeLove(data);

            if(response.error ===0){
                removeLove(response.data);
            }
            response.data
        }catch (e) {
            console.error(e)
            return {error: 1, data: "Erreur lors de la suppression du love"};

        }
    }


    const getLikes = async () => {
        try {
            let response = await PostsService.getLikes();
            if(response.error ===0){
                setLikes(response.data);
            }
            response.data
        }catch (error) {
            console.error(error);
            return {error: 1, data: "Erreur lors de la récupération des likes"};
        }
    }
    const addLikeAction = async (data) => {
        try {
            let response = await PostsService.addLike(data);

            if(response.error ===0){
                addLike(response.data);
            }
            response.data
        }catch (e) {
            console.error(e)
            return {error: 1, data: "Erreur lors de l'ajout du like"};

        }
    }
    const removeLikeAction = async (data) =>{
        try {
            let response = await PostsService.removeLike(data);
            if(response.error ===0){
                removeLike(response.data);

            }
            response.data
        }catch (e) {
            console.error(e)
            return {error: 1, data: "Erreur lors de la suppression du like"};

        }
    }

    return {
        // state
        posts,
        loves,
        likes,
        saves,
        followerPosts,
        showDialog,

        // getter
        getCountLoves,
        getCountLikes,
        getCountSaves,
        getCountPostsByUser,
        getPostsByUser,

        // mutation
        updatePosts,
        addPost,
        setLikes,
        setLoves,
        addLove,
        addLike,
        removeLove,
        removeLike,
        updateShowDialog,

        //action
        getPostsToStore,
        sendPost,
        getLoves,
        addLoveAction,
        removeLoveAction,
        getLikes,
        addLikeAction,
        removeLikeAction
    }



})







