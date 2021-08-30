import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// import local components
import Message from '../components/Message'
import Loading from '../components/Loading'
import { orderDetailsAction, orderPayAction, orderDeliverAction } from '../actions/orderActions'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants'
//import third-party components and libraries
import { Link } from 'react-router-dom'
import { Container, Row, Col, Button, ListGroup, Image, Card } from 'react-bootstrap'
import { PayPalButton } from "react-paypal-button-v2";

// AUpGCAlVA7iM1jGFu8YtBSJzSMcnJg9V9VeIAdJeEPCaWt0WYw_mlEPuXgM1YuzfPExnp0qTd55-kLsg

function OrderScreen({ history, match }) {
    const orderId = match.params.id
    const dispatch = useDispatch()

    const [sdkReady, setSdkReady] = useState(false)

    const orderDetails = useSelector(state => state.orderDetails)
    const { order, error, loading } = orderDetails
    
    const orderPay = useSelector(state => state.orderPay)
    const { success: successPay, loading: loadingPay } = orderPay

    const orderDeliver = useSelector(state => state.orderDeliver)
    const { success: successDeliver, loading: loadingDeliver } = orderDeliver

    const userLogin = useSelector(state => state.userLogin)
    const { user } = userLogin

    if(order && !loading && !error) {
        order.itemsPrice = order.orderItems.reduce((acc, item) => acc+item.price*item.qty, 0).toFixed(2)
    }

    const addPayPalScript = () => {
        const script = document.createElement('script')
        script.type = "text/javascript"
        script.src = 'https://www.paypal.com/sdk/js?client-id=AUpGCAlVA7iM1jGFu8YtBSJzSMcnJg9V9VeIAdJeEPCaWt0WYw_mlEPuXgM1YuzfPExnp0qTd55-kLsg'
        script.async = true
        script.onload = () => {
            setSdkReady(true)
        }
        document.body.appendChild(script)
    }


    useEffect(() => {
        if (user) {
            if(!order || (order._id !== Number(orderId)) || successPay || successDeliver) {
                dispatch({
                    type: ORDER_PAY_RESET
                })
                dispatch({
                    type: ORDER_DELIVER_RESET
                })
                dispatch(orderDetailsAction(orderId))
            } else if(!order.isPaid) {
                if(!window.paypal) {
                    addPayPalScript()
                } else {
                    setSdkReady(true)
                }
            }
        } else {
            history.push('/login')
        }
    }, [order, orderId, successPay, successDeliver, dispatch, user, history])

    const successPaymentHandler = (paymentResult) => {
        dispatch(orderPayAction(orderId, paymentResult))
    }

    const deliverHandler = () => {
        dispatch(orderDeliverAction(orderId))
    }

    return (
        <Container>
            {error ? <Message type="danger">{error}</Message>

            : loading ? (<Loading height={'500px'} width={'500px'} />) : 
                (
                    <div>
                        <h2>Order: #{order._id}</h2>
                        <hr></hr>
                        <Row>
                            <Col md={8}>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <h4>Shipping</h4>
                                        <p><strong>Name: </strong>{order.user.name}</p>
                                        <p><strong>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.username}</a></p>

                                        <p>
                                            <strong>Ship to: </strong>
                                            {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postCode}
                                        </p>
                                        {order.isDelivered ? (
                                            <Message type="success">Delivered on: {new Date(order.deliveredAt).toLocaleString('en-gb', {dateStyle:'medium', timeStyle: 'medium', hourCycle: 'h12'})}</Message>
                                        ) : (
                                            <Message type="warning">Not Delivered</Message>

                                        )}
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <h4>Payment Method</h4>
                                        <p>
                                            <strong>Method: </strong>
                                            {order.paymentMethod}
                                        </p>
                                        {order.isPaid ? (
                                            <Message type="success">Paid on: {new Date(order.paidAt).toLocaleString('en-gb', {dateStyle:'medium', timeStyle: 'medium', hourCycle: 'h12'})}</Message>
                                        ) : (
                                            <Message type="warning">Not Paid</Message>

                                        )}
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <h4>Items in Order</h4>
                                            <ListGroup variant="flush">
                                                {
                                                    order.orderItems.map((item, i) => (
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
                                                <Col>${order.itemsPrice}</Col>
                                            </Row>
                                        </ListGroup.Item>

                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Shipping:</Col>
                                                <Col>${order.shippingPrice}</Col>
                                            </Row>
                                        </ListGroup.Item>

                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Tax:</Col>
                                                <Col>${order.taxPrice}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        
                                        <ListGroup.Item>
                                            <Row>
                                                <Col><strong>Total:</strong></Col>
                                                <Col><strong>${order.totalPrice}</strong></Col>
                                            </Row>
                                        </ListGroup.Item>
                                        
                                        {!order.isPaid && (
                                            <ListGroup.Item>
                                            
                                                {!sdkReady ? <Loading /> : 
                                                (
                                                    <>
                                                        {loadingPay && <Loading />}
                                                        <PayPalButton 
                                                            amount={order.totalPrice}
                                                            onSuccess={successPaymentHandler} 
                                                        />
                                                    </>
                                                )}
                                            </ListGroup.Item>
                                        )}
                                        {loadingDeliver && <Loading />}
                                        {user && user.isAdmin && order.isPaid && !order.isDelivered && (
                                            <ListGroup.Item>
                                                <Button className="btn-block" onClick={deliverHandler}>Mark Delivered</Button>
                                            </ListGroup.Item>
                                        )}

                                    </ListGroup>

                                </Card>
                            </Col>
                        </Row>
                    </div>
                )
            }
            
        </Container>
    )
}

export default OrderScreen
