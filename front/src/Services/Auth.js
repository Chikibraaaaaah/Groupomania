import Api from './Api'

export default {
    signup(user){
        return Api().post('/auth/signup', user)
    },
    login(user){
        return Api().post('/auth/login', user)
    },
    getUser(id){
        return Api().get('/users/' + id)
    },
    getUsers(){
        return Api().get('/users')
    },
    updateUser(id, newContent){
        return Api().put('/users/' + id, newContent)
    },
    deleteAccount(id){
        return Api().delete('/users/' + id)
    }
}