import Axios from 'axios'
import store from '../store'

export default () => {
    return Axios.create({
        baseURL: "http://localhost:3000/api",
        headers: {
            Authorization: `${store.state.token}`
        }
    })
}

