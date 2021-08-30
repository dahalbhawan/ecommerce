import axios from 'axios'

import { 
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_FAIL,

    PRODUCT_TOP_LIST_SUCCESS,
    PRODUCT_TOP_LIST_REQUEST,
    PRODUCT_TOP_LIST_FAIL,

    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_FAIL,

    PRODUCT_DELETE_REQUEST,
    PRODUCT_DELETE_SUCCESS,
    PRODUCT_DELETE_FAIL,

    PRODUCT_CREATE_REQUEST,
    PRODUCT_CREATE_SUCCESS,
    PRODUCT_CREATE_FAIL,

    PRODUCT_UPDATE_REQUEST,
    PRODUCT_UPDATE_SUCCESS,
    PRODUCT_UPDATE_FAIL,

    PRODUCT_IMAGE_UPLOAD_REQUEST,
    PRODUCT_IMAGE_UPLOAD_SUCCESS,
    PRODUCT_IMAGE_UPLOAD_FAIL,

    PRODUCT_REVIEW_CREATE_REQUEST,
    PRODUCT_REVIEW_CREATE_SUCCESS,
    PRODUCT_REVIEW_CREATE_FAIL,

 } from '../constants/productConstants'

export const listProducts = (keyword='') => async (dispatch, getState) =>  {
    try {
        dispatch({
            type: PRODUCT_LIST_REQUEST
        })
        const { userLogin: { user } } = getState()
        var config = {}
        if (user) {
            config = {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            }
        } 
        const { data } = await axios.get(`/api/products${keyword}`, config)
        dispatch({
            type: PRODUCT_LIST_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: PRODUCT_LIST_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        })
    }
 }

 export const productsTopListAction = () => async (dispatch) =>  {
    try {
        dispatch({
            type: PRODUCT_TOP_LIST_REQUEST
        })

        const { data } = await axios.get('/api/products/top-rated/')
        dispatch({
            type: PRODUCT_TOP_LIST_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: PRODUCT_TOP_LIST_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        })
    }
 }

 export const displayProduct = (id) => async (dispatch) => {
     try {
        dispatch({
            type: PRODUCT_DETAILS_REQUEST
        })
        const { data } = await axios.get(`/api/products/${id}/`)
        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data
        })
     } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        })
     }
 }

 export const productDeleteAction = (id) => async (dispatch, getState) => {
     try {
        dispatch({
            type: PRODUCT_DELETE_REQUEST
        })

        const { userLogin: { user } } = getState()
        const config = {
            'headers': {
                'Authorization': `Bearer ${user.token}`
            }
        }

        const { data } = await axios.delete(`/api/products/delete/${id}/`, config)
        dispatch({
            type: PRODUCT_DELETE_SUCCESS,
            payload: data.detail
        })

     } catch(error) {
         dispatch ({
             type: PRODUCT_DELETE_FAIL,
             payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
         })
     }
 }

 export const productCreateAction = () => async (dispatch, getState) => {
     try {
         dispatch({
             type: PRODUCT_CREATE_REQUEST
         })

         const { userLogin: { user } } = getState()
         const config = {
             'Content-Type': 'application/json',
             'headers': {
                 'Authorization': `Bearer ${user.token}`
             }
         }

         const { data } = await axios.post('/api/products/create/', {}, config)
         dispatch({
             type: PRODUCT_CREATE_SUCCESS,
             payload: data
         })

     } catch(error) {
        dispatch ({
            type: PRODUCT_CREATE_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        })
     }
 }

 export const productUpdateAction = (id, productData) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PRODUCT_UPDATE_REQUEST
        })

        const { userLogin: { user } } = getState()
        const config = {
            'Content-Type': 'application/json',
            'headers': {
                'Authorization': `Bearer ${user.token}`
            }
        }

        const { data } = await axios.put(`/api/products/update/${id}/`, productData, config)
        dispatch({
            type: PRODUCT_UPDATE_SUCCESS,
        })
        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data
        })

    } catch(error) {
       dispatch ({
           type: PRODUCT_UPDATE_FAIL,
           payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
       })
    }
}

export const productImageUploadAction = (formData) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PRODUCT_IMAGE_UPLOAD_REQUEST
        })

        const { userLogin: { user } } = getState()
        const config = {
            'Content-Type': "multipart/form-data",
            'headers': {
                'Authorization': `Bearer ${user.token}`
            }
        }
        
        await axios.post('/api/products/upload-image/', formData, config)

        dispatch({ type: PRODUCT_IMAGE_UPLOAD_SUCCESS })
        
    } catch(error) {
        dispatch ({
            type: PRODUCT_IMAGE_UPLOAD_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        })
    }
}

export const productReviewCreateAction = (reviewData) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PRODUCT_REVIEW_CREATE_REQUEST
        })

        const { userLogin: { user } } = getState()
        const { productDetails: { product } } = getState()

        const config = {
            'headers': {
                'Authorization': `Bearer ${user.token}` 
            }
        }

        const { data } = await axios.post(`/api/products/${product._id}/reviews/create/`, reviewData, config)

        dispatch({
            type: PRODUCT_REVIEW_CREATE_SUCCESS,
            payload: data.detail
        })

        dispatch(displayProduct(product._id))
    } catch(error) {
        dispatch ({
            type: PRODUCT_REVIEW_CREATE_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        })
    }
}  