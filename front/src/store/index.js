import Vue from 'vue'
import Vuex from 'vuex'
// import Posts from '../Services/Posts'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    actualUser: {},
    users: [],
    publication: {},
    publications: [],
    comment: {},
    comments: [],
    like: {},
    likes: [],
    token: {},
    isLogged: false,
    message: "",
    notifications: []
  },
  mutations: {
    INITIALISE_STORE(state, token){
      if(localStorage.getItem('userId')){
        // state.isLogged = true
        // token = JSON.parse(localStorage.getItem('userId')),
        // state.user = state.users.filter( element => element.id == token.userId)
        console.log(token)
      }
    },

    //            Partie USER

    SET_TOKEN(state, token){
      state.token = token
      state.isLogged = true
    },
    SET_ACTUAL_USER(state, user){
      state.actualUser = user
    },

    LOGOUT(state){
      state.isLogged = false,
      state.token = null,
      state.user = {}
    },
    GET_USER(state, user){
      state.user = user
    },
    GET_USERS(state, users){
      state.users = users
    },
    DELETE_USER(state, user){
      state.users = [ ...state.users.filter( element => element.id !== user.id)]
      state.actualUser = {}
      state.isLogged = false
      localStorage.clear()
    },
   
    CREATE_PUBLICATION(state, publication){
      state.publication = publication,
      state.publications.unshift(publication)
    },
    GET_PUBLICATION(state, publication){
      state.publication = publication
    },
    GET_PUBLICATIONS(state, publications){
      state.publications = publications
    },
    DELETE_PUBLICATION(state, publication){
      state.publications = state.publications.filter( element => element.id !== publication.id)
    },
    CREATE_COMMENT(state, comment){
      state.comment = comment
      state.comments.unshift(comment)
    },
    GET_COMMENTS(state, comments){
      state.comments = comments
    },
    GET_COMMENT(state, comment){
      state.comment = comment
    },
    DELETE_COMMENT(state, comment){
      state.comments = [...state.comments.filter( element => element.id !== comment.id)]
      state.comment = {}
    },
    
  },
  actions: {
    
    setToken({commit}, token){
      commit('SET_TOKEN', token)
    },
    setActualUser({commit}, user){
      commit('SET_ACTUAL_USER', user)
    },
    logout({commit}){
      commit('LOGOUT')
    },
    getUser({commit}, user){
      commit('GET_USER', user)
    },
    getUsers({commit}, users){
      commit('GET_USERS', users)
    },
    deleteUser({commit}, user){
      commit('DELETE_USER', user)
    },
    createPublication({commit}, publication){
      commit('CREATE_PUBLICATION', publication)
    },
    getPublication({commit}, publication){
      commit('GET_PUBLICATION', publication)
    },
    getPublications({commit}, publications){
      commit('GET_PUBLICATIONS', publications)
    },
    deletePublication({commit}, publication){
      commit('DELETE_PUBLICATION', publication)
    },
    createComment({commit}, comment){
      commit('CREATE_COMMENT', comment)
    },
    getComments({commit}, comments){
      commit('GET_COMMENTS', comments)
    },
    getComment({commit}, comment){
      commit('GET_COMMENT', comment)
    },
    deleteComment({commit}, comment){
      commit('DELETE_COMMENT', comment)
    },
    like({commit}, like){
      commit('LIKE', like)
    },
    dislike({commit}, dislike){
      commit('DISLIKE', dislike)
    }
  },
  modules: {
  }
})
