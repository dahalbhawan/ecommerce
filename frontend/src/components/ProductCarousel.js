import React from 'react'

import { Carousel, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function ProductCarousel({ products }) {
    return (
        <Carousel pause="hover" fade={true} className="bg-info">
            {products?.map((product, i) => (
                <Carousel.Item key={i} className="text-center">
                    <Link to={`/products/${product._id}`}>
                        <Carousel.Caption className="text-primary" style={{position: 'absolute', bottom: '0'}}>
                            <h5 style={{fontSize:"2.3vh"}}><strong>{product.name} (${product.price})</strong></h5>
                        </Carousel.Caption>
                        <Image fluid roundedCircle
                            className="p-3"
                            style={{
                                objectFit:"cover",
                                objectPosition: "top center",
                                height: "40vh",
                                width: "40vh",
                            }}
                            src={product.image}
                            alt={product.name}
                        />
                    </Link>
                </Carousel.Item>
            ))}
        </Carousel>
    )
}

export default ProductCarousel
