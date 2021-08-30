import { 
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_FAIL,

    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,

    ORDER_PAY_REQUEST,
    ORDER_PAY_SUCCESS,
    ORDER_PAY_FAIL,

    ORDER_LIST_USER_REQUEST,
    ORDER_LIST_USER_SUCCESS,
    ORDER_LIST_USER_FAIL,

    ORDER_LIST_REQUEST,
    ORDER_LIST_SUCCESS,
    ORDER_LIST_FAIL,

    ORDER_DELIVER_REQUEST,
    ORDER_DELIVER_SUCCESS,
    ORDER_DELIVER_FAIL,

 } from '../constants/orderConstants'

import axios from 'axios'

 export const orderCreateAction = (orderData) => async(dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_CREATE_REQUEST
        })
        const { userLogin: { user } } = getState()
        console.log(user)
        const config = {
            'Content-Type': 'application/json',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        }
        const { data } = await axios.post('/api/orders/add/', orderData, config)
        dispatch({
            type: ORDER_CREATE_SUCCESS,
            payload: data
        })

    } catch(error) {
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message

        })
    }
 }

 export const orderDetailsAction = (id) => async (dispatch, getState) => {
     try {
        dispatch({
            type: ORDER_DETAILS_REQUEST
        })

        const { userLogin: { user } } = getState()

        const config = {
            'Content-Type': 'application/json',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        }

        const { data } = await axios.get(`/api/orders/${id}/`, config)

        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data
        })

     } catch(error) {
         dispatch({
             type: ORDER_DETAILS_FAIL,
             payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
         })
     }
}

export const orderPayAction = (id, paymentResult) => async(dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_PAY_REQUEST
        })
        
        const { userLogin: { user } } = getState()

        const config = {
            'Content-Type': 'application/json',
            'headers': {
                'Authorization': `Bearer ${user.token}`
            }
        }

        const { data } = axios.put(`/api/orders/${id}/pay/`, paymentResult, config)
        dispatch({
            type: ORDER_PAY_SUCCESS,
            payload: data
        })

    } catch(error) {
        dispatch({
            type: ORDER_PAY_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        })
    }
}

export const orderUserListAction = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_LIST_USER_REQUEST
        })

        const { userLogin: { user } } = getState()
        const config = {
            'headers': {
                'Authorization': `Bearer ${user.token}`
            }
        }
        const { data } = await axios.get('/api/orders/my-orders/', config)
        dispatch({
            type: ORDER_LIST_USER_SUCCESS,
            payload: data
        })

    } catch(error) {
        dispatch({
            type: ORDER_LIST_USER_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        })
    }
}

export const orderListAction = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_LIST_REQUEST
        })

        const { userLogin: { user } } = getState()

        const config = {
            'headers': {
                'Authorization': `Bearer ${user.token}`
            }
        }

        const { data } = await axios.get('/api/orders/', config)

        dispatch({
            type: ORDER_LIST_SUCCESS,
            payload: data
        })

    } catch(error) {
        dispatch({
            type: ORDER_LIST_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        })
    }
}

export const orderDeliverAction = (id) => async(dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_DELIVER_REQUEST
        })
        
        const { userLogin: { user } } = getState()
        const config = {
            'Content-Type': 'application/json',
            'headers': {
                'Authorization': `Bearer ${user.token}`
            }
        }

        await axios.put(`/api/orders/${id}/deliver/`, {}, config)
        dispatch({
            type: ORDER_DELIVER_SUCCESS,
        })

    } catch(error) {
        dispatch({
            type: ORDER_DELIVER_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        })
    }
}

