import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

// import local components
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../actions/cartActions'

// import third-party libraries and components
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'

//import styles
import '../styles/screens/CartScreen.css'

function CartScreen({ match, location, history }) {
    const productId = match.params.id
    const qty = location.search ? Number(location.search.split('=')[1]) : 1

    const dispatch = useDispatch()
    const cart = useSelector(state => state.cart)
    const { cartItems } = cart

    useEffect(() => {
        if (productId) {
            dispatch(addToCart(productId, qty))
        }
    }, [dispatch, productId, qty])

    const setQty = (productId, qty) => {
        dispatch(addToCart(productId, Number(qty)))
    }

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id))
    }

    const checkoutHandler = () => {
        history.push('/login?redirect=shipping')
    }

    return (
        <Row>
            <Col md={8}>
                <h4>CART</h4>
                <hr></hr>
                { 
                    cartItems?.length === 0 ? 
                        <Message type="info">Your cart is empty. <Link to='/'><Button variant="danger" size="sm">{`<<< Go Back`}</Button></Link></Message>
                        : (
                            <ListGroup variant="flush">
                                {
                                    cartItems?.map(cartItem => (
                                        <ListGroup.Item key={cartItem.product}>
                                            <Row>
                                                <Col md={2}>
                                                    <Image src={cartItem.image} alt={cartItem.name} fluid rounded />
                                                </Col>
                                                <Col md={3}>
                                                    <Link to={`/products/${cartItem.product}`}>{cartItem.name}</Link>
                                                </Col>
                                                <Col md={2}>
                                                    $<strong>{cartItem.price}</strong>
                                                </Col>
                                                <Col md={2}>
                                                    <Form.Control size="sm" as="select" value={cartItem.qty} title="Quantity" onChange={e => setQty(cartItem.product, e.target.value)}>
                                                        {[...Array(cartItem.countInStock).keys()].map((i) => (
                                                            <option key={i+1} value={i+1}>{i+1}</option>    
                                                        ))}
                                                    </Form.Control>
                                                </Col>
                                                <Col md={2}>
                                                    <Button type="button" variant="danger" size="sm" title="Remove from Cart" onClick={() => removeFromCartHandler(cartItem.product)}><i className="fa fa-trash-alt fa-sm"></i></Button>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))
                                }
                            </ListGroup>
                        )
                }
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h4>Subtotal ({cartItems.reduce((acc, cartItem) => acc + cartItem.qty, 0)}) items</h4>
                            $<strong>{(cartItems.reduce((acc, cartItem) => acc+cartItem.totalPrice, 0)).toFixed(2)}</strong>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Button type="button" variant="success" block disabled={cartItems?.length === 0} onClick={checkoutHandler}>Proceed to Checkout</Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    )
}

export default CartScreen
