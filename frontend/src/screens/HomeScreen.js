import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

//import local components
import Product from '../components/Product'
import Loading from '../components/Loading'
import Message from '../components/Message'
import Paginator from '../components/Paginator'
import ProductCarousel from '../components/ProductCarousel'
import { listProducts, productsTopListAction } from '../actions/productActions'

//import third-party components and libraries
import { Row, Col } from 'react-bootstrap'

function HomeScreen({ history }) {

    const dispatch = useDispatch()

    const productList = useSelector(state => state.productList)
    const { error, loading, products, page, numPages } = productList

    const topProductsList = useSelector(state => state.topProducts)
    const { loading: loadingTopProducts, products: topProducts } = topProductsList

    let keyword = history.location.search
    useEffect(() => {
        dispatch(listProducts(keyword))
        dispatch(productsTopListAction())
    }, [dispatch, keyword])

    return (
        <div>
            {!keyword && 
                <div className="mb-3">
                    {loadingTopProducts ? <Loading /> : (
                        <ProductCarousel products={topProducts} /> 
                    )}
                </div>
            }
            <h4>LATEST ARRIVALS</h4>
            <hr></hr>
            {loading ? <Loading height={'500px'} width={'500px'} />
                : error ? <Message type="danger">{error}</Message>
                : <div>
                    <Row>
                        {products.map(product => (
                            <Col key={product._id} xs={6} md={4} lg={4} xl={3}>
                                <Product product={product}/>
                            </Col>
                        ))}
                    </Row>
                    <Paginator numPages={numPages} page={page} keyword={keyword} />
                </div>
            }   
        </div>
    )
}

export default HomeScreen
