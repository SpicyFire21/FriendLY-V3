import CommentService from '@/services/comment.service'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCommentStore = defineStore('comments', () =>{
    //state
    const comments = ref([])
    //getter

    //mutation
    const setCurrentComments = (data) => {
        comments.value = data;
    }
    const addComment = (data) =>{
        comments.value.push(data)
    }


    //action
    const getComments = async () => {
        try {
            let response = await CommentService.getComments();

            if (response.error === 0) {
                setCurrentComments(response.data);
            } else {
                console.error(response);
            }
        } catch (error) {
            console.error("getConversation | Erreur:", error);
            return {error: 1, data: "Erreur lors de la récupération des messages"};
        }
    }

    return {
        //state
        comments,
        //mutation
        setCurrentComments,
        addComment,
        //action
        getComments
    }
})





