import axios from 'axios'
import { ORDER_LIST_USER_RESET } from '../constants/orderConstants'

import { 
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,
    USER_PROFILE_REQUEST,
    USER_PROFILE_SUCCESS,
    USER_PROFILE_FAIL,
    USER_PROFILE_RESET,
    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_FAIL,
    USER_UPDATE_RESET,
    USER_LIST_REQUEST,
    USER_LIST_SUCCESS,
    USER_LIST_FAIL,
    USER_LIST_RESET,
    USER_DELETE_REQUEST,
    USER_DELETE_FAIL,
    USER_DELETE_SUCCESS,
    USER_UPDATE_ADMIN_REQUEST,
    USER_UPDATE_ADMIN_SUCCESS,
    USER_UPDATE_ADMIN_FAIL,
 } from '../constants/userConstants'

 export const userLogin = (email, password) => async dispatch => {
    try {
        dispatch({
            type: USER_LOGIN_REQUEST,
        })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.post('api/users/login/', {'username': email, 'password': password }, config)
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        })
        localStorage.setItem('user', JSON.stringify(data))
    } catch(error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        })
    }
 }

 export const userLogout = () => async dispatch => {
    localStorage.removeItem('user')
    localStorage.removeItem('shippingAddress')
     dispatch({
         type: USER_LOGOUT
     })
     dispatch({
         type: USER_PROFILE_RESET
     })
     dispatch({
         type: ORDER_LIST_USER_RESET
     })
     dispatch({
         type: USER_LIST_RESET
     })

 }

 export const userRegister = (email, name, password) => async (dispatch) => {
     try {
         dispatch({
             type: USER_REGISTER_REQUEST
         })
         const config = {
             headers: {
                 'Content-Type': 'application/json'
             }
         }
         const { data } = await axios.post('/api/users/register/', {'email': email, 'name': name, 'password': password}, config)
         dispatch({
             type: USER_REGISTER_SUCCESS,
             payload: data
         })

         dispatch({
             type: USER_LOGIN_SUCCESS,
             payload: data
         })
         localStorage.setItem('user', JSON.stringify(data))
     } catch(error) {
         dispatch({
             type: USER_REGISTER_FAIL,
             payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
         })
     }
 }

 export const getUserProfile = (id) => async (dispatch, getState) => {
     try {
        dispatch({
            type: USER_PROFILE_REQUEST
        })
        const { userLogin: { user } } = getState()
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        }
        const { data } = await axios.get(`/api/users/${id}/`, config)
        dispatch({
            type: USER_PROFILE_SUCCESS,
            payload: data
        })
     } catch(error) {
        dispatch({
            type: USER_PROFILE_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        })
     }
 }

 export const updateUserProfile = (userInfo) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_UPDATE_REQUEST
        })
        const { userLogin: { user } } = getState()
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        }
        const { data } = await axios.put(`/api/users/profile/update/`, userInfo,  config)
        dispatch({
            type: USER_UPDATE_SUCCESS,
            payload: data
        })
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
        })
        localStorage.setItem('user', JSON.stringify(data))
    } catch(error) {
        dispatch({
            type: USER_UPDATE_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        })
    }
 }

 export const userUpdateProfileReset = () => async dispatch => {
     dispatch({
         type: USER_UPDATE_RESET
     })
 }

 export const userListAction = () => async (dispatch, getState) => {
     try {
         dispatch({
             type: USER_LIST_REQUEST
         })
         const { userLogin: { user } } = getState()
         const config = {
             'headers': {
                 'Authorization': `Bearer ${user.token}`
             }
         }

         const { data } = await axios.get('/api/users/', config)

         dispatch({
             type: USER_LIST_SUCCESS,
             payload: data
         })

     } catch(error) {
         dispatch({
             type: USER_LIST_FAIL,
             payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
         })
     }
 }

 export const userDeleteAction = (id) => async (dispatch, getState) => {
     try {
        dispatch({
            type: USER_DELETE_REQUEST
        })

        const { userLogin: { user }} = getState()
        const config = {
            'headers': {
                'Authorization': `Bearer ${user.token}`
            }
        }
        const { data } = await axios.delete(`/api/users/delete/${id}/`, config)
        dispatch({
            type: USER_DELETE_SUCCESS,
            payload: data.detail
        })
     } catch (error) {
        dispatch({
            type: USER_DELETE_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        })
     }
 }

 export const userUpdateAction = (id, userData) => async (dispatch, getState) => {
     try {
        dispatch({
            type: USER_UPDATE_ADMIN_REQUEST
        })
        const { userLogin: { user } } = getState()
        const config = {
            'Content-Type': 'application/json',
            'headers': {
                'Authorization': `Bearer ${user.token}`
            }
        }
        const { data } = await axios.put(`/api/users/update/${id}/`, userData, config)
        dispatch({
            type: USER_UPDATE_ADMIN_SUCCESS,
            payload: data
        })
     } catch(error) {
        dispatch({
            type: USER_UPDATE_ADMIN_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        })
     }
 }