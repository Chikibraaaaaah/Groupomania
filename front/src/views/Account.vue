<template>
  <v-container>
        <v-main v-if="isLogged">
            <h2>{{ $route.params.userName }}<v-icon  v-if="allowed" @click="editUserName = !editUserName">mdi-pen</v-icon> </h2>
                    <v-form ref="newUserName" v-if="editUserName" >
                        <v-text-field v-model="newUserName" :rules="userNameRules "  autofocus clearable outlined shaped type="text"></v-text-field>
                        <v-btn icon @click="updateUserName"> <v-icon>mdi-check</v-icon></v-btn>
                    </v-form>

            <v-card class="mb-4">

                <div class="d-sm-flex mx-auto">
    
                    <div id="userProfile" class="col-sm-2">
                        <v-img v-if="user.imageUrl != null"   :src="user.imageUrl"></v-img>
                        <v-img v-else  src="../assets/icon.png"></v-img>
                        <v-file-input v-if="allowed" type="file" prepend-icon="mdi-camera" accept="image/png, image/jpeg, image/bmp, image/gif"  enctype="multipart/form-data" ref="profile" hide-input class="input-group--focused camera"  @change="upload"> </v-file-input>
                    </div>

                    <v-divider vertical></v-divider>
                        <div class="col-12" >
                               
                            <v-col >
                                <h4 class="mt-2" >Un mot sur {{ $route.params.userName }}: 
                                        <v-icon v-if="allowed" @click="descriptionEdit = !descriptionEdit" >mdi-pen</v-icon>
                                </h4>
                                <p v-if="user.description != null"> {{ user.description }} </p>
                                <p v-else> {{ $route.params.userName }} n'a pour le moment pas renseigné de description</p>
                                <div v-if="descriptionEdit" class="col-lg-8"  >
                                    <v-text-field v-model="newDescription" label="Modifiez votre description actuelle" autofocus ></v-text-field>
                                    <v-btn  @click="updateDescription"  > <v-icon>mdi-check</v-icon></v-btn>
                                </div>
                            </v-col>
                        
                        
                            <div class="col-lg-8">
                                <p>Adresse email: <v-icon v-if="allowed" @click="emailEdit = !emailEdit" >mdi-pen</v-icon></p>
                                <p> {{user.email }} </p>
                                <div v-if="emailEdit"  >
                                    <v-form ref="newEmail">
                                        <v-text-field :rules="emailRules"  v-model="newEmail" label="Modifier votre adresse email"></v-text-field>
                                        <v-btn icon @click="updateEmail"> <v-icon>mdi-check</v-icon></v-btn>
                                    </v-form>
                                </div>
                            </div>
                               
                           <div class="col-12 mb-2 col-lg-8" v-if="allowed">
                                Gestion du compte 
                                <div class="d-flex col" >
                                     <v-btn class="mr-4 col-6 col-sm-3 col-lg-2" @click="passwordEdit = !passwordEdit" >
                                        Modifier <br/> mot de passe
                                        <v-icon>mdi-account-cog</v-icon>
                                    </v-btn>

                                    <v-btn class="col-6 col-sm-3 col-lg-2" @click="overlay = !overlay" >
                                        Supprimer <br/>  compte
                                        <v-icon>
                                            mdi-account-remove
                                        </v-icon>
                                    </v-btn>
                                </div>

                               <div class="col-12">
                                    <v-alert v-if="successAlert" class="mx-auto "  type="success" dense shaped > {{ message }} </v-alert>
                                     <v-alert v-if="errorAlert" class="mx-auto " dense shaped  type="error" >> {{ messageErreur }} </v-alert>
                                   </div> 
                  


                                <v-form ref="newPassword"   v-if="passwordEdit" class="mt-4 col-10 ">
                                    <v-text-field label="Nouveau mot de passe" v-model="newPassword"  type="password" clearable outlined :rules="passwordRules" shaped></v-text-field>
                                    <v-text-field label="Confirmer le nouveau mot de passe" v-model="newPasswordConfirm" type="password" clearable outlined :rules="passwordRules" shaped></v-text-field>
                                    <v-btn @click="updatePassword" icon> <v-icon>mdi-check</v-icon></v-btn>
                                </v-form>   

                                <v-row justify="center" >
                                    <v-overlay :value="overlay" class="col-12" >
                                        <div class="col-10 mx-auto">
                                            <h5 class="deleteWarning">Êtes-vous certain de vouloir supprimer votre compte ?! ?</h5>
                                            <div class="row mt-8">
                                                <v-btn text @click="deleteAccount" class="mx-auto red">Supprimer</v-btn>
                                                <v-btn @click="overlay = false" class="mx-auto green">Annuler</v-btn>
                                            </div>
                                        </div>
                                    </v-overlay>
                                </v-row>
                            </div>
                        </div>
                    </div>
            </v-card>


           <v-card class="col-12">
                <h3 class="text-center mb-4">Retrouvez toute son activité ici</h3>
                <div class="d-lg-flex ">
                   
                    <OwnPublis class="col-xl-4" />
                    <v-divider vertical></v-divider>

                    <v-card class="pt-4 pl-4 col-xl-4 mx-auto" elevation="4">
                        <h3 >  {{ $route.params.userName }} a également....</h3>
                        <div  v-if="userActivity.length > 0">
                            <v-list id="userActivity">
                                <v-list-item-content v-for="noti in userActivity" :key="noti.id"> ... {{ noti.type }} à la  <router-link :to="{name: 'PubliDetail', params: {userName: noti.Publication.User.userName, id: noti.Publication.id }}">  publication de {{ noti.Publication.User.userName }} </router-link> </v-list-item-content>
                            </v-list>
                        </div>
                        <div v-else>
                            <h3> ... réagit à aucune publications </h3>
                            <v-img contain src="../assets/inspi.png" ></v-img>
                        </div>
                    </v-card>
                </div>
           </v-card>
        </v-main>
        <v-main v-else> {{ this.$router.push({name: "Auth"}) }} </v-main>
  </v-container>
</template>
<script>

import OwnPublis from '../components/OwnPublis.vue'
import Auth from '../Services/Auth'

export default {
    computed: {
        isLogged(){
            return this.$store.state.isLogged
        },
         userActivity(){
          return this.$store.state.notifications.filter( element => element.User.id == this.$store.state.user.id)
        },
        allowed(){
            if(this.$route.params.userName === this.$store.state.actualUser.userName || this.$store.state.user.isModerator == true){
                return true
            }else{
                return false
            }
        },
        user(){
         return this.$store.state.user
        }
    },
    data(){
        return {
            newUserName: "",
            newDescription: "",
            newEmail: "",
            newImageProfile: "",
            newPassword: "",
            newPasswordConfirm: '',

            descriptionEdit: false,
            emailEdit: false,
            editPicture: false,
            editUserName: false,
            passwordEdit: false, 

            message: "",
            messageErreur:"",
            deleteWarning: false,
            successAlert: false,
            errorAlert: false,
            overlay: false,
            emailRules: [
                v => /.+@.+\..+/.test(v)|| 'Vous devez renseigner une adresse email valide', 
                v => !!v || "Il faut obligatoirement renseigner une adresse email"
            ],
             userNameRules: [
                v => v.length > 4 || "Votre nom d'utilisateur doit contenir au moins 5 caractères", 
                v => !!v || "Le nom d'utilisateur est obligatoire"
            ],
            passwordRules: [
                v => v.length > 7 ||"Votre mot de passe doit contenir min 8 caractères",
                v => !!v || "Il faut obligatoirement renseigner un mot de passe",
                 v => /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(v) || "Votre mot de passe doit contenir un chiffre, une majuscule, Min 8 caractères"
            ],
        }
    },
    components: {
        OwnPublis
    },
    methods: {
        
        updateUserName(){
           const newName = {
               userName: this.newUserName
           }
           Auth.updateUser(this.$store.state.user.id, newName)
           .then( res => {
               this.successAlert = true
               this.message = res.data.message
               this.closeAlert()
               Auth.getUser(this.$store.state.actualUser.id)
               .then( res => {
                   this.$store.dispatch('setActualUser', res.data)
                    const router = this.$router
                    setTimeout( () => {
                        router.push({name: 'Account', params: {userName: this.newUserName}})
                    }, 400)
                    this.editUserName = false
                   this.$store.dispatch('getUser', this.$router.params.userName)
               })
               .catch( error => console.log(error.response))
          
            
           })
           .catch( error => {
               if( error.response.status == 504 ){
                   this.errorAlert = true
                   this.messageErreur = "Ce nom d'utilisateur est déjà utilisé"
                   this.closeAlert()
               }
           })           
        },
        updateDescription(){
            const newDescription = {
                description: this.newDescription
            }
            Auth.updateUser(this.$store.state.user.id, newDescription)
            .then( res => {
                this.successAlert = true
                this.message = res.data.message
                this.closeAlert()
                this.refresh()
                this.descriptionEdit = !this.descriptionEdit
            })
            .catch( error => console.log( error ))
        },
        updatePassword(){
            const newPassword = {
                password: this.newPassword
            }
            const validateForm = this.$refs.newPassword.validate()
            if(validateForm == true){
                if(this.newPassword !== this.newPasswordConfirm){
                 this.errorAlert = true,
                 this.messageErreur = "Les 2 mots de passe doivent être identique"
                 this.closeAlert()
                 return
                }else{
                    Auth.updateUser(this.$store.state.user.id, newPassword)
                    .then( res => {
                        this.successAlert = true
                        this.message = res.data.message
                        this.closeAlert()
                        this.refresh()
                        this.passwordEdit = !this.passwordEdit
                    })
                    .catch( error => console.log( error ))
                }
            }else{
                 this.errorAlert = true,
                 this.messageErreur = "Veuillez respecter les critères de mot de passe"
                 this.closeAlert()
            }
            
        },
        updateEmail(){
            const newEmail = {
                email: this.newEmail
            }
            Auth.updateUser(this.$store.state.user.id, newEmail)
            .then( res => {
                this.successAlert = true
                this.message = res.data.message
                this.closeAlert()
                this.refresh()
                this.emailEdit = !this.emailEdit
            })
            .catch( error => console.log( error ))
        },
        deleteAccount(){
            Auth.deleteAccount(this.$store.state.user.id)
            .then( res => {
                console.log(res)
                this.successAlert = true
                this.message = res.data.message
                this.$store.dispatch('deleteUser', this.user)
            })
            .catch( error => console.log( error ))
        },
        upload(payload){
            const formData = new FormData()
            formData.append('image', payload)
            formData.append('userId', this.$store.state.user.id)

            Auth.updateUser(this.$store.state.user.id, formData)
            .then( res => {
                this.successAlert = true
                this.message = res.data.message
                this.closeAlert()
                this.refresh()
                Auth.getUser(this.$store.state.actualUser.id)
                .then( res => {
                    this.$store.dispatch('setActualUser', res.data)
                    this.$store.dispatch('getUser', res.data)
                })
                .catch( error => console.log( error ))
            })
            .catch( error => console.log( error ))
        },
        refresh(){
            Auth.getUser(this.$store.state.user.id)
            .then( res => {
                // this.$store.dispatch('getUser', res.data)
                // this.$store.dispatch('setActualUser', res.data)
                console.log(res.data)
                // const router = this.$router
                // router.push({name: 'Account', params: {userName: this.$store.state.actualUser.userName}})
            })
            .catch( error => console.log( error ))
        },
        closeAlert(){
            setTimeout( () => {
                this.errorAlert = false,
                this.successAlert = false
            }, 1500)
        } 
    },
    created(){ 
        const user = this.$store.state.users.filter( element => element.userName === this.$route.params.userName)[0]
        this.$store.dispatch('getUser', user)
    }
}

</script>

<style>

#userProfile{
    position: relative;
}
.camera{
    position: absolute;
    left: 42%;
    bottom: 2%;
}
</style>