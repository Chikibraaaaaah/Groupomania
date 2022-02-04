import Api from './Api'
// import store from '../store'

export default {
    createPublication(publication){
        return Api().post('/publications', publication)
    },
    getPublications(){
        return Api().get('/publications')
    },
    getPublication(id){
        return Api().get('/publications/' + id)
    },
    updatePublication(id, newContent){
        return Api().put('/publications/'+ id, newContent)
    },
    deletePublication(id){
        return Api().delete('/publications/' + id)
    },
    createComment(comment){
        return Api().post('/comments', comment)
    },
    updateComment(id, newComment){
        return Api().put('/comments/' + id, newComment)
    },
    deleteComment(comment){
        return Api().delete('/comments/' + comment.id)
    },
    getGlobalActivity(){
        return Api().get('/notifications')
    },
    like(like){
        return Api().post('/likes', like)
    },
    dislike(dislike){
        return Api().post('/likes', dislike)
    }
}