<template>
  <v-container>
      <v-row justify-content="center" >
          <v-col align-self="center" class="col-xl-6 mx-auto" >
              <h2 class="text-center mb-6"> {{ secondTitre }} </h2>
              <v-form ref="login" class="row" id="authForm"  > 
                   <v-text-field label="Adresse email" v-model="email" type="email" class="col-xl-6 " clearable outlined :rules="emailRules" shaped></v-text-field>
                    <v-text-field label="Mot de passe" v-model="password" type="password" class="col-xl-6 " clearable outlined :rules="passwordRules" shaped></v-text-field>
                    <v-btn  @click.prevent="login" class="mx-auto">Se Connecter <v-icon>mdi-login</v-icon></v-btn>              
              </v-form>
               <v-alert prominent type="warning" class="mt-6 col-xl-6-auto text-center" rounded elevation="8" dense v-if="error"  >{{ errorMsg }}</v-alert>     
          </v-col>
      </v-row>
  </v-container>
</template>

<script>
export default {
    data(){
        return {
            secondTitre: "Découvrez ce qu'ils s'est passé en votre absence !",
            email: "",
            password: "",
            emailRules: [
                v => /.+@.+\..+/.test(v)|| 'Vous devez renseigner une adresse email valide', 
                v => !!v || "Il faut obligatoirement renseigner une adresse email"
            ],
            passwordRules: [
                v => v.length > 8 ||"Votre mot de passe doit contenir min 8 caractères",
                v => !!v || "Il faut obligatoirement renseigner un mot de passe",
                 v => /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(v) || "Votre mot de passe doit contenir un chiffre, une majuscule, Min 8 caractères"
            ],
            error: false,
            errorMsg: ""
            
        }
    },
    methods: {
        login(){
            const validateForm = this.$refs.login.validate()
            if(validateForm == true){
                this.error = false
                 const user = {
                    email: this.email,
                    password: this.password
                }
                this.$emit('login', user)
            }else{
                this.error = true
                this.errorMsg = "Veuillez respectez les consignes svp"
            }
        },
        closeAlert(){
            setTimeout(() => {
                this.error = false
                this.success = false
            },1000 )
        }
    }
}
</script>

<style>

</style>