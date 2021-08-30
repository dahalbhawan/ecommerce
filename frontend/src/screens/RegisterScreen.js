import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'

// import local components
import Loading from '../components/Loading'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { userRegister } from '../actions/userActions'

//import third-party components and libraries
import { Form, Button, Row, Col, FormControl } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'

function RegisterScreen({ history, location }) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordError, setPasswordError] = useState(null)

    const registeredUser = useSelector(state => state.userRegister)
    const { registering, user, error } = registeredUser

    const redirect = location.search ? location.search.split('=')[1] : '/'
    
    const dispatch = useDispatch()

    const submitHandler = (e) => {
        e.preventDefault()
        if (!passwordError) {
            dispatch(userRegister(email, name, password))
        } 
    }

    useEffect(() => {
        if (user) {
            history.push(redirect)
        }
    },[history, user, redirect])

    useEffect(() => {
        if (password !== confirmPassword){
            setPasswordError('Your password and confirm password do not match.')
        }
        else {
            setPasswordError(null)
        }
    }, [confirmPassword, password])

    return (
        <FormContainer>
        {registering ? <Loading width="500px" height="500px" /> : (
            <div>
                {error && <Message type="danger">{error}</Message>}
                <h3>Register</h3>
                <hr></hr>
                <Form onSubmit={e => submitHandler(e)}>
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
                            required
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
                            required
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
                    <Button type="submit" variant="success" block>Create Account</Button>
                </Form>
                <Row className="py-3">
                    <Col>
                        Already have an account?  <Link
                                                    to={redirect ? `/login?redirect=${redirect}` : '/login'}
                                                 >
                                                    Sign In
                                                </Link>
                    </Col>
                </Row>
            </div>
        )}
        </FormContainer>
    )
}

export default RegisterScreen
