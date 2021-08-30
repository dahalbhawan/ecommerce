import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'

// import local components
import Loading from '../components/Loading'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { userLogin } from '../actions/userActions'

//import third-party components and libraries
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'

function LoginScreen({ history, location }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [infoMessage, setInfoMessage] = useState('')
    const dispatch = useDispatch()

    const redirect = location.search ? location.search.split('=')[1] : '/'
    
    const currentUser = useSelector(state => state.userLogin)
    const { loggingIn, user, error } = currentUser

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(userLogin(email, password))
        setErrorMessage('')
        setInfoMessage('')
    }

    useEffect(() => {
        setInfoMessage('')
        setErrorMessage(error)
    }, [error])

    useEffect(() => {
        if(redirect === '/shipping'){
            setErrorMessage('')
            setInfoMessage("Please Login to start shopping.")
        }
    }, [redirect])

    useEffect(() => {
        if (user) {
            history.push(redirect)
        }
    },[history, user, redirect])

    return (
        <FormContainer>
        {loggingIn ? <Loading width="500px" height="500px" /> : (
            <div>
                {error && <Message type="danger">{errorMessage}</Message>}
                {infoMessage && <Message type="warning">{infoMessage}</Message> }
                <h3>Sign-In</h3>
                <hr></hr>
                <Form onSubmit={e => submitHandler(e)}>
                    <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
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
                    <Button type="submit" variant="success" block>Sign In</Button>
                </Form>
                <Row className="py-3">
                    <Col>
                        Don't have and account?  <Link
                                                    to={redirect ? `/register?redirect=${redirect}` : '/register'}
                                                 >
                                                    Register
                                                </Link>
                    </Col>
                </Row>
            </div>
        )}
        </FormContainer>

    )
}

export default LoginScreen
