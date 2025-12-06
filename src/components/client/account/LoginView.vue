<template>
  <div class="login">
    <BubbleAnimation />
    <h1><b>FriendLY {{}}</b></h1>

    <!-- Formulaire de connexion -->
    <div class="login-container" v-if="registered">
      <h2>Connexion</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="pseudo">Pseudo</label>
          <input
              placeholder="Votre pseudo"
              type="text"
              id="pseudo"
              v-model="user.pseudo"
              required
          />
        </div>

        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input
              placeholder="Votre mot de passe"
              type="password"
              id="password"
              v-model="user.password"
              required
          />
        </div>

        <p v-if="succesMessage" class="custom-succes">{{ succesMessage }}</p>
        <p v-if="errorMessage" class="custom-error">{{ errorMessage }}</p>

        <div class="form-links">
          <a>Mot de passe oublié ?</a>
          <a @click="goRegistered">Créer un compte</a>
        </div>

        <button type="submit">Se connecter</button>
      </form>
    </div>

    <!-- Formulaire d'inscription -->
    <div class="register-container" v-else>
      <h1>Inscription</h1>
      <form @submit.prevent="register">
        <div class="form-group">
          <label for="pseudo">Pseudo</label>
          <input
              placeholder="Votre pseudo"
              type="text"
              id="pseudo"
              v-model="newUser.pseudo"
              required
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
              placeholder="Votre email"
              type="email"
              id="email"
              v-model="newUser.email"
              required
          />
        </div>

        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input
              placeholder="Entrez un mot de passe"
              type="password"
              v-model="newUser.password"
              required
          />
          <input
              placeholder="Remettez votre mot de passe"
              type="password"
              v-model="newUser.password2"
              required
          />
        </div>

        <p v-if="errorMessage" class="custom-error">{{ errorMessage }}</p>

        <div class="form-links">
          <a @click="goLogin">Compte existant ?</a>
        </div>

        <button type="submit">Créez votre compte</button>
      </form>
    </div>

    <br />
    <em>Rejoint les {{ countUser }} utilisateurs sur <b>FriendLY</b></em>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import BubbleAnimation from "@/components/animation/Bubbles.vue"
import { useUserStore } from "@/stores/index.js"

// ✅ STORE
const userStore = useUserStore()

// ✅ ROUTER
const router = useRouter()

// ✅ DATA (remplace data())
const user = ref({
  pseudo: "",
  password: ""
})
const newUser = ref({
  pseudo: "",
  password: "",
  password2: "",
  email: ""
})
const succesMessage = ref("")
const errorMessage = ref("")
const registered = ref(true)

// ✅ COMPUTED (remplace computed:)
const countUser = computed(() => {
  const count = userStore.users.length
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`
  return count.toString()
})

// ✅ METHODS (remplace methods:)
const goRegistered = () => {
  errorMessage.value = ""
  registered.value = false
}

const goLogin = () => {
  errorMessage.value = ""
  registered.value = true
}

const register = async () => {
  errorMessage.value = ""
  succesMessage.value = ""
  const lengthMdp = 12

  const pseudo = newUser.value.pseudo.trim()
  const email = newUser.value.email.trim()
  const mdp = newUser.value.password.trim()
  const mdp2 = newUser.value.password2.trim()

  if (!pseudo || !email || !mdp || !mdp2) {
    errorMessage.value = "Tous les champs doivent être remplis"
    return
  }
  if (mdp !== mdp2) {
    errorMessage.value = "Vos mot de passe sont différents"
    return
  }
  if (mdp.length < lengthMdp) {
    errorMessage.value = `Le mot de passe doit contenir au moins ${lengthMdp} caractères`
    return
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  if (!emailRegex.test(email)) {
    errorMessage.value = "L'email n'est pas valide"
    return
  }

  const regex = /^[A-Za-z0-9_]+$/
  if (!regex.test(pseudo)) {
    errorMessage.value =
        "Le pseudo doit contenir uniquement des lettres, des chiffres ou des underscores."
    return
  }

  try {
    await userStore.getUsersToStore()
    const pseudoExists = userStore.users.some(u => u.pseudo === pseudo)

    if (pseudoExists) {
      errorMessage.value = `le pseudo ${pseudo} existe déjà`
      return
    }

    const response = await userStore.registerUserToStore(newUser.value)

    if (response.error === 0) {
      succesMessage.value = "Votre compte a été créé"
      registered.value = true
    } else {
      errorMessage.value = response.data
    }
  } catch (error) {
    console.error(error)
  }
}

const login = async () => {
  try {
    const response = await userStore.loginUserToStore(user.value)
    if (response.error === 0) {
      sessionStorage.setItem("currentUser", JSON.stringify(response.data))
      userStore.updateCurrentUser(response.data)
      router.push({ name: "home" })
    } else {
      errorMessage.value = response.data
    }
  } catch (err) {
    console.error("LoginView.vue | Erreur lors de la connexion", err)
  }
}
</script>

<style scoped>
.login-container,.register-container {
  width: 300px;
  padding: 20px;
  background: var(--BlancPur);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  text-align: center;
  z-index: 10;
}

.login h1{
  z-index: 100;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.form-links {
  display: flex;
  flex-direction: column;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--GrisNuit);
  border-radius: 5px;
}

button {
  width: 100%;
  padding: 10px;
  background: var(--Violet);
  color: var(--BlancPur);
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background: var(--BleuClair);
  transition: background-color 0.1s ease, transform 0.1s ease;

}

.custom-error {
  color: var(--red);
  margin-top: 10px;
}

.custom-succes {
  color: var(--green);
  margin-top: 10px;
}

.login {
  width: 100%;
  height: 100%;
  background:

      linear-gradient(0deg, rgba(168, 216, 255, 1) 0%, rgba(245, 245, 245, 0.7) 45%),
      url('@/assets/fond-logo.webp') left/contain no-repeat,
      #007bff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.logo{
  aspect-ratio: 1/1;
  width: 60px;
}
</style>
