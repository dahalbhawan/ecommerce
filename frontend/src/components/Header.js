import React from 'react'

//import local components
import SearchBar from './SearchBar'
import { userLogout } from '../actions/userActions'

//import third-party components and libraries
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

//import styles
import '../styles/components/Header.css'

function Header({ history }) {
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.userLogin)
    const { user } = currentUser

    const logoutHandler = (e) => {
        e.preventDefault()
        dispatch(userLogout())
        .then((_) => {
            return history?.push("/")
        })
    }

    return (
        <Navbar bg="primary" expand="lg" variant="dark" className="header p-3 mb-3">
            <Container>
                <LinkContainer to='/'>
                    <Navbar.Brand>MY SHOP</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <SearchBar />
                    
                    <Nav className="ml-auto">
                        <LinkContainer exact to="/">
                            <Nav.Link><i className="fas fa-home"></i> HOME</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/cart">
                            <Nav.Link><i className="fas fa-shopping-cart"></i> CART</Nav.Link>
                        </LinkContainer>
                        {user ? (
                            <NavDropdown title={<span><i className="fas fa-id-badge"></i> {user.name}</span>} id="username">
                                <LinkContainer to="/profile">
                                    <NavDropdown.Item><i className="fas fa-user-circle"></i> PROFILE</NavDropdown.Item>
                                </LinkContainer>
                    
                                <NavDropdown.Item onClick={e => logoutHandler(e)}><i className="fas fa-sign-out-alt"></i> SIGN OUT</NavDropdown.Item>
        
                            </NavDropdown>
                        ): (
                            <>
                                <LinkContainer to="/login">
                                    <Nav.Link><i className="fas fa-user"></i> LOGIN</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/register">
                                    <Nav.Link><i className="fas fa-user-plus"></i> REGISTER</Nav.Link>
                                </LinkContainer>
                            </>
                        )}

                        {user && user.isAdmin && (
                            <NavDropdown title={<span><i className="fas fa-user-cog"></i> ADMIN</span>} id="admin-menu">
                                <LinkContainer to="/admin/users">
                                    <NavDropdown.Item><i className="fas fa-users"></i> USERS</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="/admin/products">
                                    <NavDropdown.Item><i className="fab fa-product-hunt"></i> PRODUCTS</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="/admin/orders">
                                    <NavDropdown.Item><i className="fas fa-cart-arrow-down"></i> ORDERS</NavDropdown.Item>
                                </LinkContainer>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header
