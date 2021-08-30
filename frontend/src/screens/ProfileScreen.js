import React, {useState, useEffect} from 'react'

// import local components
import Loading from '../components/Loading'
import Message from '../components/Message'
import { getUserProfile, updateUserProfile, userUpdateProfileReset } from '../actions/userActions'
import { orderUserListAction } from '../actions/orderActions'

//import third-party components and libraries
import { Form, Button, Row, Col, FormControl, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector, useDispatch } from 'react-redux'

function ProfileScreen({ history }) {
    const passwordErrorMessage = "Your password and confirm password do not match."
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [message, setMessage] = useState('')

    const userProfile = useSelector(state => state.userProfile)
    const updatedUserProfile = useSelector(state => state.updateUserProfile)
    const { orders, loading: loadingOrders, error: errorOrders } = useSelector(state => state.userOrders)

    const userLogin = useSelector(state => state.userLogin)
    const { loading, userInfo, error } = userProfile
    const { user } = userLogin 
    const { success } = updatedUserProfile
    
    const dispatch = useDispatch()

    const submitHandler = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setMessage(passwordErrorMessage)
        } else {
            dispatch(updateUserProfile({
                id: user._id,
                name: name, 
                email: email, 
                password: password
            }))
            setMessage('')
        }
    }

    useEffect(() => {
        if (!user) {
            history.push('/login?redirect=/profile')
        } else {
            dispatch(orderUserListAction())
            if (!userInfo || !userInfo.name || success || userInfo._id !== user._id) {
                dispatch(userUpdateProfileReset())
                dispatch(getUserProfile('profile'))
            } else {
                setName(userInfo.name)
                setEmail(userInfo.email)
            }
        }
    },[history, user, userInfo, dispatch, success])

    useEffect(() => {
        if (password !== confirmPassword){
            setPasswordError(passwordErrorMessage)
        }
        else {
            setPasswordError(null)
        }
    }, [confirmPassword, password])

    return (
        <Row>
            <Col md={3}>
                <h3>Profile</h3>
                <hr></hr>
                {message && <Message type="danger">{message}</Message>}
                {error && <Message type="danger">{error}</Message>}
                {loading ? <Loading width="500px" height="500px" /> :
                    (<Form onSubmit={e => submitHandler(e)}>
                        <Form.Group controlId="email">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Enter full name..."
                                value={name}
                                onChange={e => setName(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                required
                                type="email"
                                placeholder="Enter email..."
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password..."
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="confirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password once again..."
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                isInvalid={Boolean(passwordError)}
                            >
                            </Form.Control>
                            <FormControl.Feedback type="invalid">
                                {passwordError}
                            </FormControl.Feedback>
                        </Form.Group>
                        <Button type="submit" variant="success" block>Update Profile</Button>
                    </Form>
                    )
                }
                
            </Col>
            <Col md={9}>
                <h3>Order History</h3>
                {errorOrders && <Message type="danger">{errorOrders}</Message>}
                {loadingOrders ? <Loading /> : 
                    (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Order #</th>
                                    <th>Date</th>
                                    <th>Total</th>
                                    <th>Paid</th>
                                    <th>Delivered</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, i) => (
                                    <tr key={i}>
                                        <td>{order._id}</td>
                                        <td>{(new Date(order.createdAt)).toLocaleString()}</td>
                                        <td>${order.totalPrice}</td>
                                        <td>
                                            {order.isPaid ? 
                                                <span className="text-success"><i className="far fa-check-circle"></i> Yes</span> : 
                                                <span className="text-warning"><i className="far fa-times-circle"></i> No</span>}
                                        </td>
                                        <td>
                                            {order.isDelivered ? 
                                                <span className="text-success"><i className="far fa-check-circle"></i> Yes</span> : 
                                                <span className="text-warning"><i className="far fa-times-circle"></i> No</span>}
                                        </td>
                                        <td className="text-center">
                                            <LinkContainer to={`order/${order._id}`}>
                                                <Button className="btn-sm" variant="info">Details</Button>
                                            </LinkContainer>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            
                        </Table>
                    )
                }
            </Col>
        </Row>
    )
}

export default ProfileScreen
