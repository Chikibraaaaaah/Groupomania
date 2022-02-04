<template>
  <v-container fluid class="post-box  ">
      <v-form
      
        enctype="multipart/form-data"
        class=" row"
      >
          <v-textarea label="Message"
            v-model="content"
            class="input-group--focused col-lg-6 "
          ></v-textarea>

           <input
                @change="uploadImage"
                type="file"
                accept="image/png, image/jpeg,
                image/bmp, image/gif"
                ref="file"
                class="input-group--focused  col-lg-6 mx-auto"
                id="file"
              />

              <v-btn  @click.prevent="createPubli" text  class="mb-4 col-lg-4 mt-4 mx-auto" >Publier <v-icon>mdi-send</v-icon></v-btn>
      </v-form>
              <v-alert type="success"   v-if="alert" > {{ message }} </v-alert>
               <v-alert type="warning"  v-if="warning" > {{ message }} </v-alert>
  </v-container>
</template>


<script>
import Posts from '../Services/Posts';

export default {
  data() {
    return {
      content: "",
      image: "",
      message:"",
      alert: false,
      warning : false
    };
  },
  computed:{

  },
  methods: {
    uploadImage() {
      this.image = this.$refs.file.files[0];
    },
    createPubli() {

      if(this.content.length < 1 ){
        this.warning = true
        this.message = "Vous n'avez rien écrit"
        this.closeAlert()
        return
      }

      const formData = new FormData();
      formData.append("publiContent", this.content);
 
      if (this.image !== null) {
        formData.append("image", this.image);
      }

      Posts.createPublication(formData,  {
      headers: {
          'Content-Type': 'multipart/form-data'
      }})
      .then( res => {
        this.content = "",
        this.image = ""
          this.alert = true
          this.message = res.data.message
          this.closeAlert()
          Posts.getPublications()
          .then( res => {
          this.$store.dispatch('getPublications', res.data.rows)
          document.getElementById('file').value = null
          })
          .catch( error => console.log( error ))
        }
      )
      .catch( error => {
        console.log(error)
      })  
    },
    closeAlert(){
      setTimeout( () => {
        this.alert = false
        this.warning = false
      }, 2000)
    },
  },
};
</script>

<style lang="css" scoped>

</style>