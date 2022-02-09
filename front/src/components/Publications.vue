<template>
  <v-container  >
      <v-card hover  v-for="publication in publications" :key="publication.id" class="mt-8">
          <div class="d-flex user">
              <v-avatar class="mt-2 ml-2" >
                  <v-img v-if="publication.User.imageUrl !== null" :src="publication.User.imageUrl" ></v-img>
                  <v-img v-else src="../assets/icon.png" ></v-img>
              </v-avatar>
                <router-link  :to="{name: 'Account', params: {userName:  publication.User.userName}}">
                <v-card-title >{{ publication.User.userName }}</v-card-title>
              </router-link> 
          </div>

          <router-link :to="{name: 'PubliDetail', params: {userName: publication.User.userName, id: publication.id}}">
              <figure >
                   <v-img  class="col-10 mx-auto" v-if="publication.imageUrl == null" contain src="../assets/icon-left-font.svg"  ></v-img>
                    <v-img   v-else contain  :src="publication.imageUrl"></v-img>
                    <figcaption  >
                         <v-card-text  class="publiContent"> {{ publication.publiContent }} </v-card-text>
                    </figcaption>
              </figure>

           
          </router-link>
          <div class="col d-flex">
              <p class="mx-auto"><v-icon >mdi-heart</v-icon> {{ publication.rate }} </p>
              <p  class="mx-auto"><v-icon >mdi-card</v-icon> {{publication.Comments.length }} </p>
          </div>                  
      </v-card> 

  </v-container>
</template>
<script>

import Posts from '../Services/Posts'

export default {
    computed:{
        publications(){
          return this.$store.state.publications
        },
    },
    mounted(){
        Posts.getPublications()
        .then( res => {
            const publications = res.data.rows
            this.$store.dispatch('getPublications', publications)

        })
    },
}
</script>

<style>

.user{
    border-bottom: 2px solid blue;
}
.publiContent{
    border-top: 2px solid blue;
     border-bottom: 2px solid blue;
}
</style>