import React, { useEffect } from 'react'

// import local components
import Loading from '../components/Loading'
import Message from '../components/Message'
import Rating from '../components/Rating'
import Paginator from '../components/Paginator'
import { listProducts, productCreateAction, productDeleteAction } from '../actions/productActions'
import { PRODUCT_DELETE_RESET, PRODUCT_CREATE_RESET } from '../constants/productConstants'

//import third-party components and libraries
import { Table, Button, Image, Row, Col } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector, useDispatch } from 'react-redux'

function ProductListScreen({ history }) {
    const dispatch = useDispatch()
    let keyword = history.location.search

    const userLogin = useSelector(state => state.userLogin)
    const { user } = userLogin

    const productList = useSelector(state => state.productList)
    const { loading, error, products, numPages, page } = productList

    const productCreate = useSelector(state => state.productCreate)
    const {loading: loadingProduct, error: errorProduct, success:successProduct, product } = productCreate

    const productDelete = useSelector(state => state.productDelete)
    const { success: successDelete, loading: loadingDelete, message: messageDelete, error: errorDelete } = productDelete

    useEffect(() => {
        dispatch({type: PRODUCT_CREATE_RESET})
        if(!user && !user?.isAdmin) {
            history.push('/login')
        }
        if(successProduct) {
            history.push(`/admin/product/${product._id}/edit`)
        } else {
            dispatch(listProducts(keyword))
        }
        
    }, [dispatch, user, history, keyword, product, successDelete, successProduct])

    useEffect(() => {
        if(messageDelete) {
            setTimeout(() => dispatch({type: PRODUCT_DELETE_RESET}), 5000)
        }
    }, [messageDelete, dispatch])

    const deleteHandler = (productId) => {
        dispatch(productDeleteAction(productId))
    }

    const createHandler = () => {
        dispatch(productCreateAction())
    }

    return (
        <div>
            {error ? <Message type="danger">{error}</Message> :
                loading ? <Loading /> : (
                    <div>
                        {messageDelete && <Message type="success">{messageDelete}</Message>}
                        {errorProduct && <Message type="success">{errorProduct}</Message>}
                        {errorDelete && <Message type="success">{errorDelete}</Message>}
                        {loadingDelete && <Loading />}
                        <Row>
                            <Col>
                                <h3>PRODUCTS</h3>
                            </Col>
                            <Col className="text-right">
                                {loadingProduct && <Loading />}
                                <Button variant="success" onClick={createHandler}><i className="fas fa-plus"></i> CREATE PRODUCT</Button>
                            </Col>
                        </Row>
                        <hr></hr>
                        <div>
                            <Table striped hover responsive className="table-xl">
                                <thead>
                                    <tr className="table-primary">
                                        <th>ID</th>
                                        <th>IMAGE</th>
                                        <th>PRODUCT</th>
                                        <th>PRICE</th>
                                        <th>STOCK</th>
                                        <th>BRAND</th>
                                        <th>CATEGORY</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product, i) => (
                                        <tr key={i}>
                                            <td>{product._id}</td>
                                            <td style={{maxWidth: '50px'}}>
                                                <Image src={product.image} alt={product.name} fluid />  
                                            </td>
                                            <td>
                                                {product.name}
                                                <Rating value={product.rating} text={`${product.numReviews} reviews`} color={"#f8e825"} />
                                            </td>
                                            <td>${product.price}</td>
                                            <td>{product.countInStock}</td>
                                            <td>{product.brand}</td>
                                            <td>{product.category}</td>
                                            <td className="text-center">
                                                <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                                    <Button variant="info" size="sm" title="Edit Product">
                                                        <i className="fas fa-pen-square"></i>
                                                    </Button>
                                                </LinkContainer>
                                                <Button onClick={() => deleteHandler(product._id)} variant="danger" size="sm" title="Delete Product">
                                                    <i className="fas fa-trash-alt"></i>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <Paginator numPages={numPages} page={page} isAdmin={true} />
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default ProductListScreen
