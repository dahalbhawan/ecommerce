import React, { useEffect } from 'react'

// import local components
import Loading from '../components/Loading'
import Message from '../components/Message'
import { userListAction, userDeleteAction } from '../actions/userActions'

//import third-party components and libraries
import { Table, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { USER_DELETE_RESET } from '../constants/userConstants'

function UserListScreen({ history }) {
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.userLogin)
    const { user } = currentUser
    const userList = useSelector(state => state.userList)
    const { loading, error, users } = userList
    const userDelete = useSelector(state => state.userDelete)
    const { success: successDelete, message: messageDelete } = userDelete

    useEffect(() => {
        if(user && user.isAdmin) {
            dispatch(userListAction())
        } else {
            history.push('/login')
        }
    }, [dispatch, history, user, successDelete])

    useEffect(() => {
        if (messageDelete) {
            setTimeout(() => dispatch({type: USER_DELETE_RESET}), 5000)
        }
    }, [messageDelete, dispatch])

    const deleteHandler = (userId) => {
        dispatch(userDeleteAction(userId))
    }

    return (
        <div>
            {error ? <Message type="danger">{error}</Message> :
                loading ? <Loading /> : (
                    <div>
                        {messageDelete && <Message type="success">{messageDelete}</Message>}
                        <h3>USERS</h3>
                        <hr></hr>
                        <Table striped hover responsive className="table-xl">
                            <thead>
                                <tr className="table-primary">
                                    <th>ID</th>
                                    <th>NAME</th>
                                    <th>EMAIL</th>
                                    <th>ADMIN</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, i) => (
                                    <tr key={i}>
                                        <td>{user._id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.isAdmin ? 
                                            <i className="text-success fas fa-check-circle"></i> :
                                            <i className="text-warning fas fa-times-circle"></i>
                                        }
                                        </td>
                                        <td className="text-center">
                                            <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                                <Button variant="info" size="sm" title="Edit User">
                                                    <i className="fas fa-pen-square"></i>
                                                </Button>
                                            </LinkContainer>
                                            <Button onClick={() => deleteHandler(user._id)} variant="danger" size="sm" title="Delete User">
                                                <i className="fas fa-trash-alt"></i>
                                            </Button>
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

export default UserListScreen
