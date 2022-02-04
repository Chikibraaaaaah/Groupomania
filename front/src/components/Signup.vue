<template>
  <v-container>

      <v-row justify-content="center" class="row">
          <v-col  align-self="center" class="col-xl-6 mx-auto">
              <h2 class="text-center mb-6 "> {{ secondTitre }} </h2>
                <v-form   ref="signup" class="row" id="authForm">
                    <v-text-field label="Nom d'utilisateur" v-model="userName" class="col-xl-6" :rules="userNameRules"  autofocus clearable outlined shaped type="text" ></v-text-field>
                    <v-text-field label="Adresse email" v-model="email" type="email"  class="col-xl-6" clearable outlined :rules="emailRules" shaped></v-text-field>
                    <v-text-field label="Mot de passe" v-model="password" type="password"  class="col-6" clearable outlined :rules="passwordRules" shaped></v-text-field>
                    <v-btn  class="mx-auto" @click.prevent="signup">S'Inscrire <v-icon>mdi-login</v-icon></v-btn>
                </v-form>
             <v-row align-content="center">
                 <v-alert prominent class="mx-auto mt-4"  type="warning" rounded elevation="8" dense v-if="alertError"  >La validation ne respecte pas les critères demandés</v-alert>     
             </v-row>

          </v-col>
      </v-row>

  </v-container>
</template>

<script>
export default {
    data(){
        return {
            secondTitre: "Rejoignez-la communauté",
            userName: "",
            email: "",
            password: "",
            alertError: false,
            alertSuccess: false,
             userNameRules: [
                v => v.length > 4 || "Votre nom d'utilisateur doit contenir au moins 5 caractères", 
                v => !!v || "Le nom d'utilisateur est obligatoire"
            ],
            emailRules: [
                v => /.+@.+\..+/.test(v)|| 'Vous devez renseigner une adresse email valide', 
                v => !!v || "Il faut obligatoirement renseigner une adresse email"
            ],
            passwordRules: [
                v => v.length > 8 ||"Votre mot de passe doit contenir min 8 caractères",
                v => !!v || "Il faut obligatoirement renseigner un mot de passe",
                 v => /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(v) || "Votre mot de passe doit contenir un chiffre, une majuscule, Min 8 caractères"
            ],
        }
    },
    methods: {
        signup(){
            const validateForm = this.$refs.signup.validate()
            if(validateForm == false){
                 this.alertError = true
                 this.closeAlert()
                 return
            }else{
                this.alertError = false
                const user = {
                    userName: this.userName,
                    email: this.email,
                    password: this.password
                }

                this.$emit('user-created', user)   
            }

        },
        closeAlert(){
            setTimeout( () => {
                this.alertError = false
            }, 1500) 
        }
    }
}
</script>

<style>



</style>