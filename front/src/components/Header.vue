<template>

    <v-toolbar  flat color=blue  id="toolbar" >
      

      <v-toolbar-title>
          <router-link :to="{name: 'Home'}">
            <v-img src="../assets/icon-left-font-monochrome-black.png" contain :width="width" class="mx-auto"></v-img>
            </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>


        <v-toolbar-items v-if="isLogged">

                <div class="my-auto">

                  <v-toolbar-items>                          
                        <v-icon>mdi-account-search</v-icon>
                        <v-text-field clearable name="test" class="col-3" v-model="search"></v-text-field>                                         
                    </v-toolbar-items>
                   
                    <div class="contien" v-if="this.search">
                         <div class="alert alert-secondary" v-if="this.search && getFilteredUser.length > 0">
                            {{ getFilteredUser.length }} utilisateur<span v-if="getFilteredUser.length > 1">s</span> trouvé<span v-if="getFilteredUser.length > 1">s</span>
                         </div>
                         <div class="alert alert-secondary" v-if="this.search && getFilteredUser.length ==0">
                             Aucun utilisateur trouvé
                         </div>
                        <!-- <div class="loader" v-if="loading = true"></div> -->


                        <div class="searchUserCard " v-for="user in getFilteredUser" :key="user.id"> 
                            <router-link :to="{name: 'Account', params: {userName: user.userName}}">
                                <div class="searchRes" >   
                                    <div class="card-body d-flex">
                                        
                                        <v-avatar  class="avatarSearch my-auto">
                                            <v-img v-if="user.imageUrl !== null" :src="user.imageUrl" ></v-img>
                                            <v-img v-else src="../assets/icon.png" ></v-img>
                                        </v-avatar>
                                        <h5 class="card-title my-auto ml-4 userSearched">{{user.userName}}</h5> 
                                    </div>
                                </div>
                            </router-link>
                        </div>   
                    </div>
                </div>   

        </v-toolbar-items>

            
        <v-toolbar-items>
                <v-btn v-if="isLogged" text :to="{name: 'Home'}">
                    <v-icon>mdi-home</v-icon>
                     <span class="otherDevices" v-if="breakPoint !== 'xs'">Home</span> 
                </v-btn>    
        </v-toolbar-items>

        <v-toolbar-items>       
                <v-btn v-if="isLogged" text :to="{name:'Account', params: {userName: user.userName}}">
                    <v-avatar  >
                        <v-img v-if="user.imageUrl !== null" :src="user.imageUrl" ></v-img>
                        <v-img v-else src="../assets/icon.png" ></v-img>
                    </v-avatar>
                <span class="otherDevices" v-if="breakPoint !== 'xs'"> {{ user.userName }} </span> 
            </v-btn>       
        </v-toolbar-items>

        <v-toolbar-items>
                <v-btn @click="logout" v-if="isLogged" text>
                    <v-icon>mdi-logout</v-icon>
                    <span class="otherDevices" v-if="breakPoint !== 'xs'">Déconnexion</span>                   
                </v-btn>
        </v-toolbar-items>
    </v-toolbar>
</template>

<script>
import Auth from '../Services/Auth'
export default {
    data(){
        return {
            users: [],
            search: '',
            loading: true
        }
    },
    computed: {
        isLogged(){
            return this.$store.state.isLogged
        },
        breakPoint(){
            return this.$vuetify.breakpoint.name
        },
        user(){
            return this.$store.state.actualUser
        },
         width () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 200
          case 'sm': return 300
          case 'md': return 300
          case 'lg': return 200
          case 'xl': return 300
          default: return 200
        }
      },
      getFilteredUser(){
          return this.users.filter( user => {
              return user.userName.toLowerCase().includes(this.search.toLowerCase())
          })
      }
    },
    methods: {
        logout(){
            this.$store.dispatch('logout')
        },
        getUsers(){
            Auth.getUsers()
            .then( res =>  {
        
                this.users = res.data.rows
                console.log(this.users)
            
            })
            .catch( error => console.log( error ))
        }
    },
    mounted(){
        this.getUsers()
    }
}
</script>

<style scoped>
#toolbar{
    flex-wrap: wrap;
}

.searchUserCard{
    border: 2px solid white;
    padding: 1%;
}

.searchUserCard:hover{
   opacity: 0.9;
   background: rgb(255, 185, 185);
}

.contien{
    max-height: 300px;
    overflow: auto;
    background: white;
}

.loader {
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}




</style>