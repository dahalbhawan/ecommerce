import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

//import local components
import Rating from '../components/Rating'
import Loading from '../components/Loading'
import Message from '../components/Message'
import Review from '../components/Review'
import { displayProduct, productReviewCreateAction } from '../actions/productActions'
import { PRODUCT_REVIEW_CREATE_RESET } from '../constants/productConstants'

//import third-party library and components
import { Row, Col, Button, Image, ListGroup, Card, Form } from 'react-bootstrap'

//import styles
import '../styles/screens/ProductScreen.css'

function ProductScreen({ match, history }) {
    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const dispatch = useDispatch()
    
    const currentProduct = useSelector(state => state.productDetails)
    const { error, loading, product } = currentProduct

    const userLogin = useSelector(state => state.userLogin)
    const { user } = userLogin

    const productReviewCreate = useSelector(state => state.productReviewCreate)
    const { loading: loadingReview, message: messageReview, error: errorReview } = productReviewCreate

    useEffect(() => {
        dispatch(displayProduct(match.params.id))
    }, [dispatch, match])

    useEffect(() => {
        if (messageReview || errorReview) {
            setTimeout(() => dispatch({type: PRODUCT_REVIEW_CREATE_RESET}), 5000)
        }
    }, [messageReview, errorReview, dispatch])
            
    const addToCartHandler = () => {
        history.push(`/cart/${match.params.id}?qty=${qty}`)
    }

    const submitHandler = (e) => {
        e.preventDefault()
        const reviewData = {
            rating: rating,
            comment: comment
        }
        dispatch(productReviewCreateAction(reviewData))
        setRating(0)
        setComment('')
    }

    return (
        <div className="product__container">
            <Link to="/" className="btn btn-outline-info btn-sm mb-3"> {"<<< Go Back"}</Link>
            {loading ? <Loading height={'500px'} width={'500px'} />
                : error ? <Message type="danger">{error}</Message>
                : (
                    <div>
                        <Row className="justify-content-md-center">
                            <Col lg={5} md={8} className="mb-md-3">
                                <Image src={product.image} alt={product.name} fluid />
                            </Col>
                            <Col lg={4} md={6}>
                                <ListGroup className="product__details" variant="flush">
                                    <ListGroup.Item>
                                        <h4>{product.name}</h4>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Rating value={product.rating} text={`${product.numReviews} reviews`} color={"#f8e825"} />
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        Price: $<strong>{product.price}</strong>
                                    </ListGroup.Item>
                                    <ListGroup.Item style={{textAlign: 'justify', textJustify: 'inter-word'}}>
                                        {product.description}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                            <Col lg={3} md={6}>
                                <Card>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Price:</Col>
                                                <Col>$<strong>{product.price}</strong></Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Status:</Col>
                                                <Col>{product.countInStock !== 0 ? "In Stock" : "Out of Stock"}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        {product.countInStock > 0 &&
                                            (
                                                <ListGroup.Item>
                                                    <Row>
                                                        <Col>Qty:</Col>
                                                        <Col>
                                                            <Form.Control as="select" value={qty} onChange={e => setQty(e.target.value)}>
                                                                {[...Array(product.countInStock).keys()].map((i) => (
                                                                    <option key={i+1} value={i+1}>{i+1}</option>    
                                                                ))}
                                                            </Form.Control>
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
                                            )
                                        }
                                        <ListGroup.Item>
                                        <Button variant="success" size="md" block disabled={product.countInStock === 0} onClick={addToCartHandler}>Add to Cart</Button>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Card>
                            </Col>
                        </Row>
                        <Row className="pt-3">
                            <Col xs={12} lg={9}>
                                <div>
                                    <h5>Reviews</h5>
                                    <hr></hr>
                                    {product.reviews.length === 0 && <Message type="warning">No reviews yet.</Message>}
                                    {product.reviews.map((review, i) => (
                                        <div key={i}>
                                            <Review 
                                                name={review.name}
                                                rating={review.rating}
                                                comment={review.comment}
                                                date={new Date(review.createdAt).toLocaleString('en-gb', {dateStyle:'medium', timeStyle: 'medium', hourCycle: 'h12'})}
                                            />
                                            <hr></hr>
                                        </div>
                                    ))}
                                </div>
                                {user ? (
                                    <div>
                                        <h5>Write a review</h5>
                                        {messageReview && <Message type="success">{messageReview}</Message>}
                                        {errorReview && <Message type="danger">{errorReview}</Message>}
                                        {!loadingReview ? (
                                            <Form onSubmit={submitHandler}>
                                            <Form.Group controlId="rating">
                                                <Form.Label>Rating</Form.Label>
                                                <Form.Control as="select" value={rating} onChange={e => setRating(e.target.value)}>
                                                    <option value={0}>Please choose a rating</option>
                                                    <option value={5}>5 - Excellent</option>
                                                    <option value={4}>4 - Good</option>
                                                    <option value={3}>3 - Satisfactory</option>
                                                    <option value={2}>2 - Bad</option>
                                                    <option value={1}>1 - Very Bad</option>
                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Comment</Form.Label>
                                                <Form.Control as="textarea" rows={3} onChange={e => setComment(e.target.value)} />
                                            </Form.Group>
                                            <Button type="submit" variant="success" disabled={!Number(rating) || loadingReview}>Submit</Button>
                                        </Form>
                                        ) : <Loading />}
                                    </div>
                                    ) : null}
                            </Col>
                        </Row>
                    </div>
                )}
        </div>
    )
}

export default ProductScreen
