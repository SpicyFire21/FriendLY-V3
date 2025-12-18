import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import MessageView from '@/views/MessageView.vue'
import AccountView from '@/views/AccountView.vue'
import SettingsView from '@/components/client/account/SettingsView.vue'
import SaveView from '@/components/client/account/SaveView.vue'
import PostView from '@/components/client/post/PostView.vue'
import LoginView from '@/views/LoginView.vue'
import EditAccount from '@/views/EditAccount.vue'

import {useUserStore, usePostStore, useMessageStore} from '@/stores'

const routes =[
    {
        path: '/',
        name: 'home',
        component: HomeView,
        meta: {requiredAuth: true}
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView
    },
    {
        path: '/message',
        name: 'message',
        component: MessageView,
        meta: {requiredAuth: true}

    },

    {
        path:'/account/edit',
        name:'editaccount',
        component: EditAccount,
        meta: {requiredAuth: true}
    },
    {
        path: '/:pseudo',
        name: 'account',
        component: AccountView,
        meta: {requiredAuth: true},
        props:true,
        children: [
            {
                path: 'settings',
                name: 'settings',
                component: SettingsView,
                props:true,

            },
            {
                path: 'saves',
                name: 'save',
                component: SaveView,
                props:true,
            },
            {
                path: 'posts',
                name: 'post',
                component: PostView,
                props: true,
            },
        ]
    },


]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    const usersStore = useUserStore();
    const messagesStore = useMessageStore();

    if (to.path !== '/message') {
        messagesStore.setCurrentMessages(null)
    }
    const storedUser = sessionStorage.getItem('currentUser')
    if (storedUser) {
        usersStore.updateCurrentUser(JSON.parse(storedUser))
    }

    if (to.matched.some(record => record.meta.requiredAuth)) {
        if (!usersStore.currentUser) {
            console.log('🔴 Accès refusé, redirection vers login')
            return next({ name: 'login' })
        }
        console.log('🟢 Utilisateur authentifié, accès autorisé')
        return next()
    } else if (to.name === 'login' || to.name === 'register') {
        if (usersStore.currentUser) {
            console.log('🟠 Retour a l’accueil')
            return next({ name: 'home' })
        } else {
            console.log('🟢 Accès autorisé')
            return next()
        }
    } else {
        console.log('🟢 Accès autorisé')
        return next()
    }

})

export default router




