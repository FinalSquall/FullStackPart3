import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    const req = axios.get(baseUrl)
    return getPromiseResult(req)
}

const create = (newObj) => {
    const req = axios.post(baseUrl,newObj)
    return getPromiseResult(req)
}

const update = (id,updObj) => {
    const req = axios.put(`${baseUrl}/${id}`,updObj)
    return getPromiseResult(req)
}

const deletePerson = (id) => {
    const req = axios.delete(`${baseUrl}/${id}`)
    return req
}

function getPromiseResult(req) {
    return req.then(response => response.data)
}

export default {
    getAll,create,update,deletePerson
}