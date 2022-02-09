<template>
    <div class="col-xl-5 mx-auto">
        <div  v-if="ownPublis.length > 0" >
            <v-card v-for="publi in ownPublis" :key="publi.publiContent" class="mt-4 h-70"   >
                <div class="">
                    
                    
                    <v-card-title id="userOwnPubli">{{ publi.User.userName }}</v-card-title>
                </div>

                <router-link :to="{name: 'PubliDetail', params: { id: publi.id}}">
                    <div class="" >
                        <v-img contain  :src="publi.imageUrl" v-if="publi.imageUrl !== null"></v-img>
                        <v-img contain  v-else  src="../assets/icon-above-font.png"></v-img>
                    </div>
                    <v-card-text id="ownPubliDetail"> {{ publi.publiContent }} </v-card-text>
                </router-link>
                <div class="col-6 col-xl-4 d-flex mx-auto" >
                    <p ><v-icon>mdi-heart</v-icon> {{ publi.rate }} </p>
                    <p class="ml-4"><v-icon >mdi-card</v-icon> {{ publi.Comments.length }} </p>
                    <v-icon>mdi-edit</v-icon>
                </div>
            </v-card>
      </div>

      <div v-else class="col-xl-6 mx-auto ">
        <h3 class="text-center"> {{$route.params.userName }} n'a pour le moment rien publié</h3>
        <v-img src="../assets/empty.jpg" ></v-img>
      </div>

    </div>

</template>

<script>
export default {
    computed: {
          ownPublis(){
            const user = this.$route.params.userName
            return this.$store.state.publications.filter( element => element.User.userName == user)
        },
    }
}
</script>

<style>

#ownPubliDetail{
    border-top: 2px solid blue;
    border-bottom: 2px solid blue;
}

#userOwnPubli{
    border-bottom: 2px solid blue;
}

</style>