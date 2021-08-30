import React from 'react'
import { Link } from 'react-router-dom'

//import local components
import Rating from './Rating'

//import third-party components and libraries
import { Card } from 'react-bootstrap'

//import styles
import '../styles/components/Product.css'

function Product({ product }) {
    return (
        <Card className="product p-3">
            <Link to={`/products/${product._id}`}>
                <Card.Img className="product__img" src={product.image} variant="top" />
            </Link>
            <Card.Body className="p-0 mt-2">
                <Link to={`/products/${product._id}`}>
                    <Card.Title>
                        <strong>{(product.name).slice(0,25)}</strong>
                        <small><Rating value={product.rating} text={`${product.numReviews} reviews`} color={"#f8e825"} /></small>
                    </Card.Title>
                </Link>
                <Card.Text className="my-2">
                    <strong>${product.price}</strong>
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Product
