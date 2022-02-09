<template>
  <v-container  >

    <h1  class="text-center mb-8">Bienvenu sur Groupomania</h1>

    <v-row justify="space-around" class="col-sm-6 mx-auto col-xl-3 ">
      <v-btn text @click="goSignup" :to="{name: 'Signup'}">S'inscrire</v-btn>
      <v-btn text @click="goLogin" :to="{name: 'Login'}">Se Connecter</v-btn>
    </v-row>



     <div>
       <Login @login="login" v-if="showLogin" />
       <Signup @user-created="signup" v-if="showSignup" />

       <div class="row">
         <v-alert elevation="4" class="mt-6 col-xl-4 mx-auto" dense shaped type="success" v-if="success" > {{successMsg}} </v-alert>
          <v-alert prominent class="mt-6 col-xl-4 mx-auto"  type="warning" rounded elevation="8" dense v-if="error" > {{errorMsg}}</v-alert>     
       </div>
        
     </div>

  </v-container>
</template>

<script>

import Signup from '../components/Signup.vue'
import Login from '../components/Login.vue'
import Auth from '../Services/Auth'


export default {
  components: {
    Signup, Login
  },
  data(){
    return {
      showSignup: false,
      showLogin: false,
      error: false,
      success: false,
      successMsg: "",
      errorMsg: ""
    }
  },
  computed: {
    isLogged(){
      return this.$store.state.isLogged
    },
    breakPoint(){
      return this.$vuetify.breakpoint.name
    }
  },
  methods: {
    goSignup(){
      this.showSignup = true
      this.showLogin = false
       this.error = false
      this.success = false
    },
    goLogin(){
      this.showLogin = true,
      this.showSignup = false
      this.error = false
      this.success = false
    },
 
    signup(user){
      Auth.signup(user)
      .then( res =>{
        this.error = false
        this.success = true
        this.successMsg = res.data.message
        this.login({email: user.email, password: user.password})

      })
      .catch( error =>{
        if(error){
         this.error = true,
         this.errorMsg = error.response.data.message
         console.log('error',  error  )
        }
       
      } )

    }, 
    login(user){
       Auth.login({email: user.email, password: user.password})
        .then( res => {
          const token = JSON.stringify(res.data) 
          this.$store.dispatch('setToken', token)
         
          Auth.getUser(res.data.userId)
          .then( res => {
            this.$store.dispatch('setActualUser', res.data)
            this.success = true
            this.successMsg = "Bonjour " + res.data.userName 
            setTimeout(() => {
              this.successMsg = "Connexion en cours"
            },1000)
            const router = this.$router
            setTimeout(function(){
              router.push({name:"Home"})
            },1500)
          })
          .catch( error => console.log( error ))
        })
         .catch( error => {
          if(error){
            console.log(error.response)
            this.error = true
            this.errorMsg = error.response.data.message
        }
      })

    
      

    },
    closeAltert(){
        this.success = false
        this.error = false
      }
  }
}
</script>

<style>
h1{
  font-size: 1.8em;
}



</style>