import React from 'react'

//import local components

//import third-party components
import { Container, Row, Col } from 'react-bootstrap'

function Footer() {
    return (
        <footer className="bg-primary text-white">
            <Container>
                <Row>
                    <Col className="text-center py-3">Copyright &copy; Bhawan</Col>
                </Row>
            </Container>
        </footer>
    )
}

export default Footer
