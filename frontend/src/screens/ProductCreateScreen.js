import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// import local components
import Loading from '../components/Loading'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { displayProduct, productUpdateAction, productImageUploadAction } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'

//import third-party components and libraries
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'

function ProductCreateScreen({ history, match }) {
    const productId = match.params.id

    const [name, setName] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState('')
    const [description, setDescription] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [isActive, setIsActive] = useState(false)
    
    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const { user } = userLogin
    
    const productDetails = useSelector(state => state.productDetails)
    const { loading: loadingProduct, error: errorProduct, product } = productDetails

    const productUpdate = useSelector(state => state.productUpdate)
    const{ loading: loadingUpdate, success: successUpdate, error: errorUpdate } = productUpdate

    const productImage = useSelector(state => state.productImageUpload)
    const { loading: loadingImage, error: errorImage } = productImage


    const submitHandler = (e) => {
        e.preventDefault()
        const productData = {
            name: name,
            brand: brand,
            category: category,
            price: price,
            description: description,
            countInStock: countInStock,
            isActive: isActive
        }
        dispatch(productUpdateAction(productId, productData))
    }

    const uploadImageHandler = async (e) => {
        const imageFile = e.target.files[0]
        const formData = new FormData()
        formData.append('image', imageFile)
        formData.append('productId', productId)
        dispatch(productImageUploadAction(formData))
        setImage(imageFile.name)
    }

    useEffect(() => {
        if(user && user.isAdmin) {
            if(successUpdate) {
                dispatch({type: PRODUCT_UPDATE_RESET})
                history.push('/admin/products')
            } else {
                if(!product || product?._id !== Number(productId)) {
                    dispatch(displayProduct(productId))
                } else {
                    setName(product.name)
                    setPrice(product.price)
                    setCategory(product.category)
                    setBrand(product.brand)
                    setImage(product.image)
                    setDescription(product.description)
                    setCountInStock(product.countInStock)
                    setIsActive(product.isActive)
                }    
            }
        } else {
            history.push('/login')
        }
        
    },[dispatch, product, productId, successUpdate, user, history])


    return (
        <div>
            <Link to="/admin/products">
                <Button variant="info" size="sm" className="mb-4">{"<<< Go Back"}</Button>
            </Link>
            <FormContainer>
            {loadingProduct ? <Loading width="500px" height="500px" /> : (
                <div>
                    {errorProduct && <Message type="danger">{errorProduct}</Message>}
                    {errorUpdate && <Message type="danger">{errorUpdate}</Message>}
                    {errorImage && <Message type="danger">{errorImage}</Message>}

                    <h3>EDIT PRODUCT</h3>
                    <hr></hr>
                    <Form onSubmit={e => submitHandler(e)}>
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Enter product name..."
                                value={name}
                                onChange={e => setName(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Row>
                            <Form.Group as={Col} controlId="brand">
                                <Form.Label>Brand</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter brand name..."
                                    value={brand}
                                    onChange={e => setBrand(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group as={Col} controlId="category">
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter product category..."
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>
                        </Row>

                        <Form.Group controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Enter description..."
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>
                        <Row>
                            <Form.Group as={Col} controlId="price">
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    required
                                    type="number"
                                    min="1"
                                    step="any"
                                    placeholder="Enter price..."
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>
                        
                            <Form.Group as={Col} controlId="count">
                                    <Form.Label>Count In Stock</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter stock count..."
                                        value={countInStock}
                                        onChange={e => setCountInStock(e.target.value)}
                                    >
                                    </Form.Control>
                            </Form.Group>
                        </Row>
                        <Form.Group controlId="formFile">
                            <Form.Label>Image</Form.Label>
                            <Form.Control 
                                type="text"
                                value={image}
                                onChange={e => setImage(e.target.value)}
                            />
                            {loadingImage && <Loading />}
                            <Form.File
                                type="image-file"
                                label="Upload image"
                                custom
                                onChange={uploadImageHandler}
                            />
                        </Form.Group>

                        <Form.Group controlId="isActive">
                            <Form.Check
                                type="checkbox"
                                label="Is Active"
                                checked={isActive}
                                onChange={e => setIsActive(e.target.checked)}
                            />
                        </Form.Group>

                
                        <Button type="submit" variant="success" block>Update</Button>
                        { loadingUpdate && <Loading />}
                    </Form>
                </div>
            )}
            </FormContainer>
        </div>
    )
}

export default ProductCreateScreen
