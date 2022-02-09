<template>
    <div  >
        <v-alert v-if="error" outlined shaped type="warning"> {{ message }} </v-alert>
        <v-form class="row">
      
                  <v-text-field class="col-8 mx-auto" v-model="comment"></v-text-field>
                 <v-btn @click="createComment" class="mx-auto mb-4">Commenter <v-icon>mdi-send</v-icon></v-btn>
   
    </v-form>
  </div>
</template>

<script>
import Posts from '../Services/Posts'
export default {
    data(){
        return {
            comment: "",
            error: false,
            message: ""
        }
    },
    methods: {
        close(){
            setTimeout(() => {
                this.error = false
            }, 1500)
        },
        createComment(){
            const comment = {
                userId: this.$store.state.actualUser.id,
                publicationId: this.$route.params.id,
                commentContent: this.comment
            }
            if(this.comment.length < 1){
                 this.error = true
                 this.message = "Vous n'avez rien écrit !"
                 this.close()
                 return
            }
            Posts.createComment(comment)
            .then( res => {
                this.$emit("comment-created", res.data.message)
                this.comment = ""
            })
            .catch( error => console.log(error))
        }
    }
}
</script>

<style>

</style>