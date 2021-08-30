import React, { useState } from 'react'

// import local components
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { saveShippingAddress } from '../actions/cartActions'

//import third-party components and libraries
import { Form, Button, FormGroup, Row, Col } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'

function ShippingScreen({ history }) {
    const dispatch = useDispatch()
    const cart = useSelector(state => state.cart)
    const { user } = useSelector(state => state.userLogin)
    const { shippingAddress } = cart

    if(!user){
        history.push('/login?redirect=/shipping')
    }

    const [address, setAddress] = useState(shippingAddress.address)
    const [city, setCity] = useState(shippingAddress.city)
    const [postCode, setPostCode] = useState(shippingAddress.postCode)
    const [province, setProvince] = useState(shippingAddress.province)
    const [country, setCountry] = useState(shippingAddress.country)

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress({ address, city, postCode, province, country }))
        history.push('/payment')
    }

    return (
        <FormContainer>
            <CheckoutSteps step1 /> 
            <hr></hr>
            <h3>Shipping</h3>
            <hr></hr>
            <Form onSubmit={e => submitHandler(e)}>
                <FormGroup controlId='address'>
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        required
                        type='text'
                        placeholder='Enter address...'
                        value={address ? address : ''}
                        onChange={e => setAddress(e.target.value)}
                    >
                    </Form.Control>
                </FormGroup>
                <Row>
                    <FormGroup as={Col} controlId='city'>
                        <Form.Label>City</Form.Label>
                        <Form.Control
                            required
                            type='text'
                            placeholder='Enter city...'
                            value={city ? city : ''}
                            onChange={e => setCity(e.target.value)}
                        >
                        </Form.Control>
                    </FormGroup>

                    <FormGroup as={Col} controlId='postCode'>
                        <Form.Label>Post Code</Form.Label>
                        <Form.Control
                            required
                            type='text'
                            placeholder='Enter post code...'
                            value={postCode ? postCode : ''}
                            onChange={e => setPostCode(e.target.value)}
                        >
                        </Form.Control>
                    </FormGroup>
                </Row>
                <Row>
                    <FormGroup as={Col} controlId='province'>
                        <Form.Label>State</Form.Label>
                        <Form.Control
                            required
                            type='text'
                            placeholder='Enter state...'
                            value={province ? province : ''}
                            onChange={e => setProvince(e.target.value)}
                        >
                        </Form.Control>
                    </FormGroup>

                    <FormGroup as={Col} controlId='country'>
                        <Form.Label>Country</Form.Label>
                        <Form.Control
                            required
                            type='text'
                            placeholder='Enter country...'
                            value={country ? country : ''}
                            onChange={e => setCountry(e.target.value)}
                        >
                        </Form.Control>
                    </FormGroup>
                </Row>
                <Button type='submit' variant='primary'>
                    Continue
                </Button>
            </Form>
        </FormContainer>
    )
}

export default ShippingScreen
