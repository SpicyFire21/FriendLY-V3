import MessageService from '@/services/message.service'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMessageStore = defineStore('messages', () =>{
    //state
    const currentMessages = ref([])
    const currentSenderId = ref(null)
    const currentReceiverId = ref(null)
    //getter

    //mutation
    const setCurrentMessages = (data) => {
        currentMessages.value = data;
    }
    const updateCurrentSenderId = (data) => {
        currentSenderId.value = data;
    }
    const addMessageMutation = (message) => {
        currentMessages.value.push(message);
    }

    const updateCurrentReceiverId = (data) => {
        currentReceiverId.value = data;
    }

    //action
    const getConversationStore = async ({idReceiver,idSender}) => {
        try {
            let response = await MessageService.getMessagesService(idReceiver,idSender);

            if (response.error === 0) {
                setCurrentMessages(response.data);
            } else {
                console.error("getConversation | Pas de données trouvées", response);
            }
            return response;
        } catch (error) {
            console.error("getConversation | Erreur:", error);
            return {error: 1, data: "Erreur lors de la récupération des messages"};
        }
    }


    const disconnectSender = async () =>{
        updateCurrentSenderId(null);
    }

    return {
        //state
        currentMessages,
        currentSenderId,
        currentReceiverId,
        //mutation
        setCurrentMessages,
        updateCurrentSenderId,
        addMessageMutation,
        updateCurrentReceiverId,
        //action
        getConversationStore,
        disconnectSender
    }
})





