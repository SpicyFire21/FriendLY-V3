import UsersService from '@/services/user.service'
import { defineStore } from 'pinia'
import { ref,computed } from 'vue'


export const useUserStore = defineStore('users', ()=>{
    //state
    const users = ref([])
    const currentUser = ref(null)
    const subscribers = ref([])
    const followers = ref([])


    //getter
    const getUserById = (id) => users.value.find(u => u.id === id) || "ERROR-USER-NOT-FOUND"
    const getCountFollowersOfCurrentUser = computed(() => followers.value.length)
    const getCountSubscribersOfCurrentUser = computed(() => subscribers.value.length)
    const getAvatarByUserID = (id) => {
        const user = users.value.find(u => u.id === id)
        return user ? user.avatar : "ERROR-AVATAR-USER-NOT-FOUND"
    }
    const getUserByPseudo = (pseudo) => {
        return users.value.find(u => u.pseudo === pseudo) || "ERROR-USER-NOT-FOUND"
    }


    //mutation
    const updateUsers = (data) =>{
        users.value = data;
    }
    const updateCurrentUser = (data) => {
        currentUser.value = data;

        if (data) {
            sessionStorage.setItem("currentUser", JSON.stringify(data));
        } else {
            sessionStorage.removeItem("currentUser");
        }
    }
    const addUser = (data) =>{
        users.value.push(data);
    }

    const setFollowers = (data) => {
        followers.value =data;
    }
    const setSubscribers = (data) => {
        subscribers.value = data;
    }
    const addFollower = (data) =>{
        followers.value.push(data)
    }
    const addSubscriber = (data) => {
        subscribers.value.push(data)
    }

    // actions
    const getUsersToStore = async () => {
        try {
            let result = await UsersService.getUsersService();

            if (result.error === 0) {
                updateUsers(result.data);
            } else {

                console.error("error", result.data);
            }
        } catch (e) {
            console.error("Erreur lors de la récupération des comptes utilisateur", e)
        }
    }
    const loginUserToStore = async (data) =>{
        try {
            let response = await UsersService.loginUser(data);
            if (response.error === 0) {
                updateCurrentUser(response.data);
            }
            return response.data;
        } catch (error) {
            console.error('store.js | Erreur lors de la connexion:', error);
            return {error: 1, data: 'Erreur lors de la connexion'};
        }
    }
    const disconnectUser = () => {
        updateCurrentUser(null);
    }
    const registerUserToStore = async (data) =>{
        try {
            let response = await UsersService.registerUserService(data);
            if (response.error === 0) {
                addUser(response.data);
            }
            return response;
        } catch (error) {
            console.error('store.js | Erreur lors de la création du compte:', error);
            return {error: 1, data: 'Erreur lors de la création du compte'};
        }
    }
    const getFollowersByUserID = async (id) =>{
        try {
            let response = await UsersService.getFollowersByUserID(id);
            if (response.error ===0){
                setFollowers(response.data)
            }

        }catch (error){
            console.error('store.js | Erreur lors de la récupération des followers de l\'utilisateur:', error);
            return {error: 1, data: 'Erreur lors de la récupération des followers de l\'utilisateur:'};
        }
    }
    const getSubscribersByUserID = async (id) =>{
        try {
            let response = await UsersService.getSubscribersByUserID(id);
            if (response.error ===0){
                setSubscribers(response.data);
            }
        }catch (error){
            console.error('store.js | Erreur lors de la récupération des subscribers de l\'utilisateur:', error);
            return {error: 1, data: 'Erreur lors de la récupération des subscribers de l\'utilisateur:'};
        }
    }
    const updateUser = async (data) => {
        try {

            let response = await UsersService.updateUser(data);
            if (response.error ===0){
                updateCurrentUser(response.data)
            }
            response.data
        }catch (error) {
            console.error('store.js | Erreur lors de la modification de l\'utilisateur:', error);
            return {error: 1, data: 'Erreur lors de la modification de l\'utilisateur'};
        }
    }
    const addFollowerAction = async (data) =>{
        try{
            let response = await UsersService.addFollower(data);
            if (response.error ===0){
                addFollower(response.data);
            }
            response.data
        }catch (error) {
            console.error('store.js | Erreur lors de l\'ajout du follower', error);
            return {error: 1, data: 'Erreur lors de l\'ajout du follower'};

        }
    }

    return {
        // state
        users,
        currentUser,
        subscribers,
        followers,
        // getters
        getUserById,
        getCountFollowersOfCurrentUser,
        getCountSubscribersOfCurrentUser,
        getAvatarByUserID,
        getUserByPseudo,
        // actions
        updateUsers,
        updateCurrentUser,
        addUser,
        setFollowers,
        setSubscribers,
        addFollower,
        addSubscriber,
        getUsersToStore,
        loginUserToStore,
        disconnectUser,
        registerUserToStore,
        getFollowersByUserID,
        getSubscribersByUserID,
        updateUser,
        addFollowerAction
    }

})







