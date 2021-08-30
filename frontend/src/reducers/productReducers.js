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
    PRODUCT_DELETE_RESET,

    PRODUCT_CREATE_REQUEST,
    PRODUCT_CREATE_SUCCESS,
    PRODUCT_CREATE_FAIL,
    PRODUCT_CREATE_RESET,

    PRODUCT_UPDATE_REQUEST,
    PRODUCT_UPDATE_SUCCESS,
    PRODUCT_UPDATE_FAIL,
    PRODUCT_UPDATE_RESET,

    PRODUCT_IMAGE_UPLOAD_REQUEST,
    PRODUCT_IMAGE_UPLOAD_SUCCESS,
    PRODUCT_IMAGE_UPLOAD_FAIL,

    PRODUCT_REVIEW_CREATE_REQUEST,
    PRODUCT_REVIEW_CREATE_SUCCESS,
    PRODUCT_REVIEW_CREATE_FAIL,
    PRODUCT_REVIEW_CREATE_RESET,

 } from '../constants/productConstants'

export const productListReducer = (state={products: []}, action) => {
    switch (action.type) {
        case PRODUCT_LIST_REQUEST:
            return {
                loading: true,
                ...state
            }
        case PRODUCT_LIST_SUCCESS:
            return {
                loading: false,
                products: action.payload.products,
                page: action.payload.page,
                numPages: action.payload.numPages
            }
        case PRODUCT_LIST_FAIL: 
            return {
                loading: false,
                error: action.payload,
            }
        default:
            return state
    }
}

export const productTopListReducer = (state={products: []}, action) => {
    switch (action.type) {
        case PRODUCT_TOP_LIST_REQUEST:
            return {
                loading: true,
                ...state
            }
        case PRODUCT_TOP_LIST_SUCCESS:
            return {
                loading: false,
                products: action.payload,
            }
        case PRODUCT_TOP_LIST_FAIL: 
            return {
                loading: false,
                error: action.payload,
            }
        default:
            return state
    }
}

export const productDetailsReducer = (state={product: {reviews: []}}, action) => {
    switch (action.type) {
        case PRODUCT_DETAILS_REQUEST:
            return {
                loading: true,
                ...state
            }
        case PRODUCT_DETAILS_SUCCESS:
            return {
                loading: false,
                product: action.payload
            }
        case PRODUCT_DETAILS_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default: 
            return state
    }
}

export const productDeleteReducer = (state={}, action) => {
    switch (action.type) {
        case PRODUCT_DELETE_REQUEST:
            return {
                loading: true
            }
    
        case PRODUCT_DELETE_SUCCESS:
            return {
                loading: false,
                success: true,
                message: action.payload
            }
        
        case PRODUCT_DELETE_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        
        case PRODUCT_DELETE_RESET:
            return {}
        
        default:
            return state
    }
}

export const productCreateReducer = (state={}, action) => {
    switch(action.type) {
        case PRODUCT_CREATE_REQUEST:
            return {
                loading: true
            }
        
        case PRODUCT_CREATE_SUCCESS:
            return {
                loading: false,
                success: true,
                product: action.payload
            }
        
        case PRODUCT_CREATE_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        
        case PRODUCT_CREATE_RESET:
            return {}
            
        default:
            return state
    }
}

export const productUpdateReducer = (state={}, action) => {
    switch(action.type) {
        case PRODUCT_UPDATE_REQUEST:
            return {
                loading: true
            }
        
        case PRODUCT_UPDATE_SUCCESS:
            return {
                loading: false,
                success: true
            }
        
        case PRODUCT_UPDATE_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        
        case PRODUCT_UPDATE_RESET:
            return {}

        default:
            return state
    }
}

export const productImageUploadReducer = (state={}, action) => {
    switch(action.type) {
        case PRODUCT_IMAGE_UPLOAD_REQUEST:
            return { loading: true }
        
        case PRODUCT_IMAGE_UPLOAD_SUCCESS:
            return { loading: false, success: true }
        
        case PRODUCT_IMAGE_UPLOAD_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        
        default:
            return state
    }
}

export const productReviewCreateReducer = (state={}, action) => {
    switch(action.type) {
        case PRODUCT_REVIEW_CREATE_REQUEST:
            return {
                loading: true
            }
        
        case PRODUCT_REVIEW_CREATE_SUCCESS:
            return {
                loading: false,
                message: action.payload,
            }
        
        case PRODUCT_REVIEW_CREATE_FAIL:
            return {
                loading: false,
                error: action.payload
            }

        case PRODUCT_REVIEW_CREATE_RESET:
            return {}
        
        default:
            return state
    }
}