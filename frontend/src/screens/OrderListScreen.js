import React, {useState, useEffect} from 'react'

// import local components
import Loading from '../components/Loading'
import Message from '../components/Message'
import { orderListAction } from '../actions/orderActions'

//import third-party components and libraries
import { Table, Button, Row, Col } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector, useDispatch } from 'react-redux'

function OrderListScreen({ history }) {
    const dispatch = useDispatch()
    const userLogin = useSelector(state => state.userLogin)
    const { user } = userLogin
    const orderList = useSelector(state => state.orderList)
    const { loading, error, orders } = orderList

    const [displayOrderItems, setDisplayOrderItems] = useState([])

    useEffect(() => {
        if(user && user.isAdmin) {
            dispatch(orderListAction())
        } else {
            history.push('/login')
        }
        
    }, [dispatch, user, history])

    const getOrderTotal = (order) => {
        return order.orderItems.reduce((acc, o) => acc+Number(o.price)*Number(o.qty), 0).toFixed(2)
    }

    const displayItems = (order) => {
        return (
            <div style={{backgroundColor: 'white', padding: '2px', minWidth: '180px'}}>
                <Row>
                    <Col>
                        <small>ITEM</small>
                    </Col>
                    <Col>
                        <small>PRICE</small>
                    </Col>
                    <Col>
                        <small>QTY</small>
                    </Col>
                </Row>
                <hr className="my-1"></hr>
                {order.orderItems.map((item, i) => (
                    <div key={i}>
                        <Row>
                            <Col>
                                <small>{item.name}</small>
                            </Col>
                            <Col>
                                <small>${item.price}</small>
                            </Col>
                            <Col>
                                <small>{item.qty}</small>
                            </Col>
                        </Row>

                        {i !== order.orderItems.length-1 && <hr className="my-1"></hr>}
                    </div>
                    ))
                }
            </div>
        )
    }

    return (
        <div>
            {error ? <Message type="danger">{error}</Message> :
                loading ? <Loading /> : (
                    <div>
                        
                        <h3>ORDERS</h3>
                        <hr></hr>
                        <Table striped hover responsive className="table-xl">
                            <thead>
                                <tr className="table-primary">
                                    <th>ID</th>
                                    <th>USER</th>
                                    <th>DATE</th>
                                    <th>ITEMS</th>
                                    <th>SUBTOTAL</th>
                                    <th>TAX</th>
                                    <th>SHIPPING</th>
                                    <th>TOTAL</th>
                                    <th>PAID</th>
                                    <th>DELIVERED</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, i) => (
                                    <tr key={i}>
                                        <td>{order._id}</td>
                                        <td>
                                            {order.user.username ? (order.user.name && order.user.name) : 
                                            <span className="text-warning">MyShop User</span>}
                                        </td>
                                        <td>
                                            {` ${new Date(order.createdAt).toLocaleString('en-gb', {dateStyle:'medium', timeStyle: 'medium', hourCycle: 'h12'})}`}
                                        </td>
                                        <td>
                                            <Button 
                                                size="sm" 
                                                className="btn-block btn-info" 
                                                onClick={() => (
                                                    displayOrderItems.includes(order._id) ? 
                                                    setDisplayOrderItems(displayOrderItems.filter((i, _) => i !== order._id)) :
                                                    setDisplayOrderItems([...displayOrderItems, order._id]
                                                ))}
                                            >
                                                {displayOrderItems.includes(order._id) ? "Hide" : "Show"}
                                            </Button>
                                            {displayOrderItems.includes(order._id) && displayItems(order)}
                                        </td>
                                        <td>${getOrderTotal(order)}</td>
                                        <td>${order.taxPrice}</td>
                                        <td>${order.shippingPrice}</td>
                                        <td><strong>${order.totalPrice}</strong></td>
                                        <td>
                                            { order.isPaid ?
                                                <span className="d-flex flex-column text-success">
                                                    <i className="far fa-check-circle"></i> 
                                                    <small>{` ${new Date(order.paidAt).toLocaleString('en-gb', {dateStyle:'medium', timeStyle: 'medium', hourCycle: 'h12'})}`}</small>
                                                    </span> : 
                                                <span className="text-warning"><i className="far fa-times-circle"></i></span>
                                            }
                                        </td>
                                        <td>
                                            { order.isDelivered ?
                                                <span className="d-flex flex-column text-success">
                                                    <i className="far fa-check-circle"></i> 
                                                    <small>{` ${new Date(order.deliveredAt).toLocaleString('en-gb', {dateStyle:'medium', timeStyle: 'medium', hourCycle: 'h12'})}`}</small>
                                                    </span> : 
                                                <span className="text-warning"><i className="far fa-times-circle"></i></span>
                                            }
                                        </td>
                                        <td>
                                            <LinkContainer to={`/order/${order._id}`}>
                                                <Button size="sm" className="btn-info">Details</Button>
                                            </LinkContainer>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )
            }
        </div>
    )
}

export default OrderListScreen
