import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
// import local components
import Loading from '../components/Loading'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { getUserProfile, userUpdateAction } from '../actions/userActions'
import { USER_PROFILE_RESET, USER_UPDATE_ADMIN_RESET } from '../constants/userConstants'

//import third-party components and libraries
import { Form, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'

function UserEditScreen({ history, match }) {
    const userId = match.params.id

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)
    
    const dispatch = useDispatch()

    const userProfile = useSelector(state => state.userProfile)
    const { loading, error, userInfo } = userProfile

    const userUpdate = useSelector(state => state.userUpdate)
    const { loading: loadingUpdate, success: successUpdate, error: errorUpdate } = userUpdate

    const submitHandler = (e) => {
        e.preventDefault()
        const userData = {
            name: name,
            email: email,
            isAdmin: isAdmin
        }
        dispatch(userUpdateAction(userId, userData))
    }

    useEffect(() => {
        if(successUpdate) {
            dispatch({
                type: USER_UPDATE_ADMIN_RESET
            })
            dispatch({
                type: USER_PROFILE_RESET
            })
            history.push('/admin/users')
        } else {
            if(!userInfo || userInfo._id !== Number(userId)) {
                dispatch(getUserProfile(userId))
            } else {
                setName(userInfo.name)
                setEmail(userInfo.email)
                setIsAdmin(userInfo.isAdmin)
            }
        }
    },[userInfo, dispatch, userId, successUpdate, history])


    return (
        <div>
            <Link to="/admin/users">
                <Button variant="info" size="sm" className="mb-4">{"<<< Go Back"}</Button>
            </Link>
            <FormContainer>
            {loading ? <Loading width="500px" height="500px" /> : (
                <div>
                    {error && <Message type="danger">{error}</Message>}
                    {errorUpdate && <Message type="danger">{errorUpdate}</Message>}
                    {loadingUpdate && <Loading />}
                    <h3>EDIT USER</h3>
                    <hr></hr>
                    <Form onSubmit={e => submitHandler(e)}>
                        <Form.Group controlId="name">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
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
                                type="email"
                                placeholder="Enter email..."
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="isAdmin">
                            <Form.Check
                                type="checkbox"
                                label="Is Admin"
                                checked={isAdmin}
                                onChange={e => setIsAdmin(e.target.checked)}
                            />
                        </Form.Group>

                
                        <Button type="submit" variant="success" block>Update</Button>
                    </Form>
                </div>
            )}
            </FormContainer>
        </div>
    )
}

export default UserEditScreen
