<template>
  <v-col v-if="relatedComments.length > 0"  >

      <div class="text-left" id="relComments">
           <p v-for="comment in relatedComments" :key="comment.id" > <span > {{comment.User.userName}} a dit: {{ comment.commentContent }} </span><span  v-if="comment.userId == $store.state.actualUser.id  || $store.state.actualUser.isModerator == true">
            <v-btn icon @click="editComment(comment)"> <v-icon>mdi-pen</v-icon></v-btn>
            <v-btn icon @click="editDeleteComment(comment)" > <v-icon>mdi-delete</v-icon></v-btn> 
                 <v-overlay v-if="deleteCom" class="row" >
                    <div class="col-11 mx-auto">
                        <p class="deleteWarning">Êtes-vous certain de vouloir supprimer cette publication ?</p>
                        <div class="row">
                            <v-btn text @click="deleteComment" class="mx-auto red">Supprimer</v-btn>
                            <v-btn @click="deleteCom = !deleteCom" class="mx-auto green">Annuler</v-btn>
                        </div>
                    </div>
                </v-overlay>
            </span>  
            </p>     
          <v-form v-if="showEditComment">
                <v-text-field v-model="newComment" ></v-text-field>
                <v-btn @click="updateComment(comment)"><v-icon>mdi-check</v-icon></v-btn>
            </v-form>  
      </div>
  </v-col>

  <v-col v-else class="col-md-5 mx-auto">
      <h4 class="text-center">Soyez le premier à commenter la publication de {{$route.params.userName }}</h4>
      <v-img contain src="../assets/noCommentYet.jpg" ></v-img>
  </v-col>
</template>

<script>
import Posts from '../Services/Posts'

export default {
    data(){
        return {
            newComment: "",
            showEditComment: false,
            deleteCom : false
        }
    },
    beforeUpdate(){
        this.$store.dispatch('getComments', this.$store.state.comments)
    },
    activated(){
        this.$store.dispatch('getComments', this.$store.state.comments)
    },
    computed: {
        relatedComments(){
            return this.$store.state.comments
        },
    },
    methods: {
        editComment(comment){
            this.showEditComment = !this.showEditComment
            this.$store.dispatch('getComment', comment)
            this.newComment = this.$store.state.comment.commentContent
        },
        updateComment(){
          const newComment = {
              commentContent: this.newComment
          }
          const comment = this.$store.state.comment
          Object.assign( comment, newComment)
          Posts.updateComment(comment.id, newComment)
          .then( res => {
              this.showEditComment = !this.showEditComment
              this.$emit('comment-updated', res.data.message)
              this.$store.state.comment = {}
          })
          .catch( error => console.log( error ))

        },
        editDeleteComment(comment){
            this.$store.dispatch('getComment', comment)
            this.deleteCom = !this.deleteCom
        },
        deleteComment(){
            this.$store.dispatch('deleteComment', this.$store.state.comment)
            Posts.deleteComment(this.$store.state.comment.id)
            .then( res => {
                this.$emit('comment-deleted', res.data.message)
                this.deleteCom = false
            })
            .catch( error => console.log( error ))
            this.$store.state.comment = {}
        }
    }
}
</script>

<style>
.commentQuote{
    position: relative;
    width: 85%;
}
.comments{
    overflow: auto;
}
.noComments{
    overflow: hidden;
}
.moderation{
    position: absolute;
    right: 5px;
}
.paraCom{
    width: 100%;
}

.overlayBtnsDelete{
    width: 20%;
    margin: auto;
    margin-left: 20%;
}

.textWarning{
    font-size: 2rem;
}

#relComments{
    padding: 2%;
    margin-bottom: 5%;
}
</style>