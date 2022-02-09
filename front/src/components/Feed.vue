<template>
  <v-container fluid class="" >
    <h4 >Ce qu'il s'est passé dernièrerment</h4>
      <v-list :max-height="height" class="overflow-auto">
        <v-list-item-content   v-for="notification in notifications" :key="notification.id" >
          <span > <router-link :to="{name:'Account', params: {userName: notification.User.userName}}"> {{ notification.User.userName }} </router-link>  a {{ notification.type }} la  <router-link :to="{name: 'PubliDetail', params: {id: notification.Publication.id}}"> publication de {{ notification.Publication.User.userName }}</router-link></span>
        </v-list-item-content>
      </v-list>
     
  </v-container>
</template>

<script>

import Posts from '../Services/Posts'
export default {
  computed: {
    notifications(){
      return this.$store.state.notifications
    },
    height () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 200
          case 'sm': return 400
          case 'md': return 500
          case 'lg': return 1600
          case 'xl': return 2000
          default: return 200
        }
    }
  },
    mounted(){
      Posts.getGlobalActivity()
      .then(res => this.$store.state.notifications = res.data.rows).catch(error => console.log( error ))
    }
  }
</script>

<style>
#brata{
 
}

</style>