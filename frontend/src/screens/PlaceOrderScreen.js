import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// import local components
import CheckoutSteps from '../components/CheckoutSteps'
import Message from '../components/Message'
import Loading from '../components/Loading'
import { ORDER_CREATE_RESET } from '../constants/orderConstants'
import { orderCreateAction } from '../actions/orderActions'
import { resetCart } from '../actions/cartActions'

//import third-party components and libraries
import { Link } from 'react-router-dom'
import { Container, Row, Col, Button, ListGroup, Image, Card } from 'react-bootstrap'

function PlaceOrderScreen({ history }) {
    const dispatch = useDispatch()

    const { order, loading, success, error } = useSelector(state => state.orderCreate)

    const cart = useSelector(state => state.cart)
    const { address, province, city, postCode } = cart.shippingAddress

    cart.itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    cart.shippingPrice = (cart.itemsPrice > 100 ? 0 : 10).toFixed(2)
    cart.taxPrice = (0.082 * cart.itemsPrice).toFixed(2)
    cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2)

    if(!cart.paymentMethod) {
        history.push('/payment')
    }

    useEffect(() => {
        if(success) {
            dispatch({
                type: ORDER_CREATE_RESET
            })
            dispatch(resetCart())
            history.push(`order/${order._id}`)
        }
    }, [dispatch, success, history, order])

    const placeOrder = () => {
        const orderData = {
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice
        }
        dispatch(orderCreateAction(orderData))
    }

    return (
        <Container>
            {loading ? (
                <Loading width="500px" height="500px" />
            ) : (
                <>
                    <CheckoutSteps step1 step2 step3 step4 />
                    <hr></hr>
                    <Row>
                        <Col md={8}>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h4>Shipping</h4>
                                    <p>
                                        <strong>Ship to: </strong>
                                        {address}, {city}, {province} {postCode}
                                    </p>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <h4>Payment Method</h4>
                                    <p>
                                        <strong>Method: </strong>
                                        {cart.paymentMethod}
                                    </p>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <h4>Items in Order</h4>
                                    {cart.cartItems.length === 0 ? (
                                        <Message type="warning">
                                            Your cart is empty
                                        </Message>
                                    ): (
                                        <ListGroup variant="flush">
                                            {
                                                cart.cartItems.map((item, i) => (
                                                    <ListGroup.Item key={i}>
                                                        <Row className="align-items-center">
                                                            <Col md={3} className="float-left">
                                                                <Image src={item.image} alt={item.name} fluid rounded />
                                                            </Col>
                                                            <Col md={6}>
                                                                <Link to={`/products/${item.product}`}>{item.name}</Link>
                                                            </Col>
                                                            <Col md={3}>
                                                                {item.qty} x ${item.price} = <strong>${(item.qty * item.price).toFixed(2)}</strong>
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                                ))
                                            }
                                        </ListGroup>
                                    )}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>

                        <Col md={4}>
                            <Card>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <h3>Order Summary</h3>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Items Total:</Col>
                                            <Col>${cart.itemsPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Shipping:</Col>
                                            <Col>${cart.shippingPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Tax:</Col>
                                            <Col>${cart.taxPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item>
                                        <Row>
                                            <Col><strong>Total:</strong></Col>
                                            <Col><strong>${cart.totalPrice}</strong></Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        {error && <Message type="danger">{error}</Message>}
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Button className="btn-block" type="button" variant="success" onClick={placeOrder}>
                                            Place Order
                                        </Button>
                                    </ListGroup.Item>

                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                </>
            )
            }
            
        </Container>
    )
}

export default PlaceOrderScreen
