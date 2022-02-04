<template>

    <v-toolbar  flat color=blue  id="toolbar" >
      

      <v-toolbar-title>
          <router-link :to="{name: 'Home'}">
            <v-img src="../assets/icon-left-font-monochrome-black.png" contain :width="width" class="mx-auto"></v-img>
            </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>
        <v-toolbar-items>
                <v-btn v-if="isLogged" text :to="{name: 'Home'}">
                    <v-icon>mdi-home</v-icon>
                     <span class="otherDevices" v-if="breakPoint !== 'xs'">Home</span> 
                </v-btn>    
        </v-toolbar-items>

        <v-toolbar-items>       
                <v-btn v-if="isLogged" text :to="{name:'Account', params: {userName: user.userName}}">
                    <v-avatar class="mr-2" >
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
export default {
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
      }
    },
    methods: {
        logout(){
            this.$store.dispatch('logout')
        },
    }
}
</script>

<style>
#toolbar{
    flex-wrap: wrap;
}
</style>