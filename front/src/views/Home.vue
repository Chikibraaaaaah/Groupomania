<template>
  <v-container class="mx-auto">
    <div  v-if="isLogged" class="col-12" >
      <h2 class="text-center mb-4"> {{ titreHome }} </h2>
      <div class="d-lg-flex">
         <div class="col-lg-6 col-sm-6 col-md-8 mx-auto order-xs-first order-lg-last">
          <v-btn text @click="show = !show" elevation="5" class="col"> <v-icon>mdi-bell</v-icon> Retrouvez l'activité de vos amis</v-btn>
          <Feed  v-if="showFeed"/>
        </div>

          <div class="publicationsPart  col-sm-6 col-md-8 col-lg-6 mx-auto">
            <div>
              <v-btn class="col"  text @click="createPubli = !createPubli" elevation=5 >Ecrire une publication<v-icon>mdi-pen</v-icon> </v-btn>
              <NewPublication   v-if="createPubli"/>
            </div>
            <v-divider class="mt-4 mb-4" ></v-divider>
            <h3 class="text-center"> {{ sousTitreHome }} </h3>
            <Publications class="publiCompo col-10 col-md-12 col-xl-8" />             
          </div>
      </div>    
    </div>
    <div v-else>
      {{$router.push({name:"Auth"})}}
    </div>

  </v-container>
</template>
<script>

import NewPublication from '../components/NewPublication.vue'
import Publications from '../components/Publications.vue'
import Posts from '../Services/Posts'
import Feed from '../components/Feed.vue'
import Auth from '../Services/Auth'

export default {
  data(){
    return {
      message: "",
      sousTitreHome: 'Retrouvez toutes les publications de nos membres',
      titreHome: 'Partagez vos souvenirs avec nos membres',
      createPubli: false,
      show: false,
      notifShow: false
    }
  },
  components: {
    NewPublication, Publications, 
    Feed
    },
  computed: {
    isLogged(){
      return this.$store.state.isLogged
    },
    showFeed(){
      if(this.$vuetify.breakpoint.name == "lg" || this.$vuetify.breakpoint.name == "xl" ){
        return true
      }else{
        return this.show 
      }
    }
  },
   created(){
        Posts.getPublications()
        .then( res => {
            const publications = res.data.rows
            this.$store.dispatch('getPublications', publications)
        })
        Posts.getGlobalActivity()
        .then( response => {
          this.$store.state.notifications= response.data.rows
        })
        Auth.getUsers()
        .then( res => {
          this.$store.dispatch('getUsers', res.data.rows)
        })
        .catch( error => console.log( error ))
    }
}
</script>

<style>

</style>