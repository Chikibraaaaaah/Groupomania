<template>
  <v-app >
    <v-app-bar app flat color=blue>
        <Header />
    </v-app-bar>


    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import Header from './components/Header.vue'
export default {
  name: 'App',

  data: () => ({
    //
  }),
  components: {
    Header
  },
  computed: {
    user(){
      return this.$store.state.ActualUser
    }
  }
};
</script>

<style>
a{
  text-decoration: none;
}
</style>
