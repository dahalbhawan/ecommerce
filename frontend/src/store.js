import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import { 
    productDeleteReducer, 
    productDetailsReducer, 
    productListReducer, 
    productCreateReducer, 
    productUpdateReducer, 
    productImageUploadReducer,
    productReviewCreateReducer,
    productTopListReducer
} from './reducers/productReducers'
import { cartReducer } from './reducers/cartReducers'
import { 
    orderCreateReducer, 
    orderDeliverReducer, 
    orderDetailsReducer, 
    orderListReducer, 
    orderPayReducer, 
    userOrderListReducer
} from './reducers/orderReducers'
import { 
    updateProfileReducer, 
    userLoginReducer, 
    userProfileReducer, 
    userRegisterReducer , 
    userListReducer, 
    userDeleteReducer,
    userUpdateReducer
} from './reducers/userReducers'

const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    cart: cartReducer,
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userProfile: userProfileReducer,
    updateUserProfile: updateProfileReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    userOrders: userOrderListReducer,
    userList: userListReducer,
    userDelete: userDeleteReducer,
    userUpdate: userUpdateReducer,
    productDelete: productDeleteReducer,
    productCreate: productCreateReducer,
    productUpdate: productUpdateReducer,
    productImageUpload: productImageUploadReducer,
    orderList: orderListReducer,
    orderDeliver: orderDeliverReducer,
    productReviewCreate: productReviewCreateReducer,
    topProducts: productTopListReducer,
})

const cartItemsFromStorage = localStorage.getItem('cartItems') ? 
    JSON.parse(localStorage.getItem('cartItems')) : []

const userFromStorage = localStorage.getItem('user') ? 
    JSON.parse(localStorage.getItem('user')) : null

const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ? 
    JSON.parse(localStorage.getItem('shippingAddress')) : {}

const paymentMethodFromStorage = localStorage.getItem('paymentMethod') ?
    JSON.parse(localStorage.getItem('paymentMethod')) : ''

const initialState = {
    cart : { 
        cartItems: cartItemsFromStorage ,
        shippingAddress: shippingAddressFromStorage,
        paymentMethod: paymentMethodFromStorage
    },
    userLogin: { 
        user: userFromStorage
    }
}
const middleware = [thunk]
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store