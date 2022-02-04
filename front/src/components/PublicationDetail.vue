<template>
        <v-container v-if="isLogged"  >
            <div v-if="$store.state.publication !== null || undedfined" class=" d-lg-flex "> 

                <v-card elevation="3" width="50%" class="col-lg-h-80" >               
                    <router-link :to="{name: 'Account', params: {userName: publication.User.userName}}">
                        <div class="col d-flex userImgPubli">
                            <v-avatar  >
                                <v-img v-if="publication.User.imageUrl !== null" :src="publication.User.imageUrl" ></v-img>
                                <v-img v-else src="../assets/icon.png" ></v-img>
                            </v-avatar>
                            <v-card-title > {{ publication.User.userName }} </v-card-title>
                        </div>
                    </router-link>
                    <div  class="col-lg-5 mx-auto" >
                        <v-img v-if="publication.imageUrl == null" src="../assets/icon-above-font.png" contain ></v-img>
                        <v-img v-else  :src="publication.imageUrl">  </v-img>
                    </div>                  
                    <v-file-input type="file" prepend-icon="mdi-camera" accept="image/png, image/jpeg, image/bmp, image/gif" ref="profile" hide-input class="input-group--focused uploadPubliPic"    enctype="multipart/form-data" v-if="allowed" @change="upload"> </v-file-input>
                    <v-card-text class="publiDetailPubliContent" v-if="!updatePubliContent"> {{ publication.publiContent }} </v-card-text>
                    <v-form v-if="updatePubliContent">
                        <v-text-field v-model="newContent"></v-text-field>
                        <v-btn icon @click="updatePublication">
                            <v-icon>mdi-check</v-icon>
                        </v-btn>
                    </v-form>

                    <div class="d-flex ">
                        <div class="d-flex mx-auto mt-2">
                            <v-btn icon  @click="dislike(publication)">
                                <v-icon>mdi-thumb-down</v-icon>
                            </v-btn>
                            <p> {{ publication.rate }} </p>
                            <v-btn icon @click="like(publication)">
                                <v-icon>mdi-thumb-up</v-icon>
                            </v-btn>
                        
                            <p class="ml-4 mt-2"> <v-icon>mdi-card</v-icon>{{ $store.state.comments.length }} </p>    
                            <div  v-if="allowed" >
                                <v-btn icon class="ml-4" @click="editPublication"><v-icon>mdi-pen</v-icon></v-btn>
                                <v-btn icon  @click="deletePubli = !deletePubli"><v-icon>mdi-delete</v-icon></v-btn>
                            </div>      
                     
                    </div> 
                      
                                      
                    </div>         
                </v-card>
                
                <div class="col-lg-6 text-center "> 
                    <h2> Découvrez les commentaires liés à la publication de {{ $route.params.userName }} </h2>
                    <v-btn icon @click="showComments = !showComments">
                        <v-icon>mdi-comment-multiple</v-icon>
                    </v-btn>
                     <RelatedComments @comment-deleted="alertDeleteComment" @comment-updated="alertUpdateComment" class="mt-6  " v-if="showComments"/>
                </div>

            </div>

            <div v-else>
                {{$route.push({name:"Home"})}}
            </div>
            <div class="row mt-2" >
                <h3 class=" mx-auto">Commentez la publication de {{ publication.User.userName }}</h3>
                  <v-alert class="col-10 mx-auto" v-if="alert" shaped dense type="success" elevation=6 > {{ message }} </v-alert>
                <NewComment @comment-created="commentCreated" class="col-10 mx-auto" />
            </div>

             <v-overlay v-if="deletePubli" class="row" >
                    <div class="col-11 mx-auto">
                        <p class="deleteWarning">Êtes-vous certain de vouloir supprimer cette publication ?</p>
                        <div class="row">
                            <v-btn text @click="deletePublication" class="mx-auto red">Supprimer</v-btn>
                            <v-btn @click="deletePubli = false" class="mx-auto green">Annuler</v-btn>
                        </div>
                    </div>
                </v-overlay>
        </v-container>

        <v-container v-else>
            {{ $router.push({name:'Auth'}) }}
        </v-container>
</template>

<script>
import Posts from '../Services/Posts'
import NewComment from '../components/NewComment.vue'
import RelatedComments from '../components/RelatedComments.vue'



export default {
    data(){
        return {
            message: "",
            newContent: "",
            updatePubliContent: false,
            success: false,
            editComment: false,
            image: "",
            alert: false,
            deletePubli: false,
            showComments: false 
        }
    },
    computed: {
        publication(){
            return this.$store.state.publication
        },
        isLogged(){
            return this.$store.state.isLogged
        },
        relatedComments(){
            if (this.$store.state.comments.length < 1){
                return false
            }else{
                return this.$store.state.comments
            }
        },
        allowed(){
             const userId = JSON.parse(this.$store.state.token).userId 
            if(this.publication.User.id == userId || this.$store.state.actualUser.isModerator == true){
                return true
            }else{
                return false
            }
        } ,
        // heigth(){
        //      switch (this.$vuetify.breakpoint.name) {
        //     case 'xs': return 200
        //     case 'sm': return 300
        //     case 'md': return 500
        //     case 'lg': return 500
        //     case 'xl': return 500
        //     default: return 200
        // }
        // }

    },
    created(){ 
         Posts.getPublication(this.$route.params.id)
        .then( res =>{
            this.$store.dispatch('getPublication', res.data)
            this.$store.dispatch('getComments', this.$store.state.publication.Comments)
            this.$store.state.likes = this.$store.state.publication.Likes
        })
        .catch( error => console.log(error))
    },
    components: {
        NewComment,
        RelatedComments
    },
    methods: {
        editPublication(){
            this.updatePubliContent = !this.updatePubliContent
            this.newContent = this.$store.state.publication.publiContent
            console.log( this.$store.state.publication.publiContent)
        },
        updatePublication(){
            const newContent = {
                publiContent: this.newContent
            }
            Posts.updatePublication(this.publication.id, newContent)
            .then( res => {
                this.alert = true
                this.message = res.data.message
                this.updatePubliContent = !this.updatePubliContent
                this.$store.state.publication.publiContent = newContent.publiContent
                this.newContent = this.$store.state.publication.publiContent
                this.closeAlert()
                this.updatePubliContent = false
                this.newContent = ""
            })
            .catch( error => {
                console.log( error )
            })
        },
        deletePublication(){
            Posts.deletePublication(this.publication.id)
            .then( res => {
                this.alert = true
                this.message = res.data.message
                this.$store.dispatch('deletePublication', this.publication)
                const router = this.$router
                setTimeout(function(){
                    router.push({name: "Home"})
                }, 1500) 
            })
            .catch( error => console.log( error ))
        },
        like(publi){   
            const like = {
               userId: this.$store.state.actualUser.id,
               publicationId: publi.id,
               rate: 1
           }
           Posts.like(like)
           .then( res => {
               this.alert = true
               this.message = res.data.message
               this.closeAlert()
               this.refresh()
           })
           .catch( error => console.log( error ))
        },
        dislike(publi){
            const dislike = {
                userId: this.$store.state.actualUser.id,
                publicationId: publi.id,
                rate: -1
            }
            Posts.like(dislike)
            .then( res => {
               this.alert = true
               this.message = res.data.message
               this.closeAlert()
               this.refresh()
            })
            .catch( error => console.log( error ))

        }, 
        upload(payload){
            this.image = payload
            const formData = new FormData()
            formData.append('image', this.image)
            formData.append('userId', this.$store.state.actualUser.id)

            Posts.updatePublication(this.$store.state.publication.id, formData)
            .then( res => {
                this.alert = true
                this.message = res.data.message
                this.closeAlert()
                Posts.getPublication(this.$store.state.publication.id)
                .then( res => {
                    this.$store.dispatch('getPublication', res.data)
                })
                .catch( error => console.log( error ))
            })
            .catch( error => console.log( error ))
        },
        closeAlert(){
            setTimeout( () => {
                this.alert = false
            }, 1500)
        },
        commentCreated(payload){
            this.alert = true
            this.message = payload
            this.closeAlert()
            this.refresh()
        },
        alertDeleteComment(payload){
            this.alert = true
            this.message = payload
            this.closeAlert()
        },
        alertUpdateComment(payload){
            this.alert = true
            this.message = payload
            this.closeAlert()
        },
        refresh(){
             Posts.getPublication(this.publication.id)
               .then( res => {
                   this.$store.dispatch('getPublication', res.data)
                   this.$store.dispatch('getComments', res.data.Comments)
                   this.$store.state.likes = res.data.Likes
                   console.log(this.$store.state.likes)
                })
               .catch( error => console.log( error ))
        }
    }
}
</script>

<style>

.uploadPubliPic{
    margin: auto;
    width: 10%;
}

.userImgPubli{
    border-bottom: 2px solid blue;
}

.publiDetailPubliContent{
    border-bottom: 2px solid blue;
    border-top: 2px solid blue;
}

.deleteWarning{
    font-size: 1.6em;
    text-align: center;

}
</style>