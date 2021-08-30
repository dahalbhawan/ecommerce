import React from 'react'

import { Spinner } from 'react-bootstrap'

function Loading({ height, width }) {
    return (
        <Spinner animation='grow' role='status' style={{
            height: {height}, 
            width: {width},
            margin: 'auto',
            display: 'block'
        }}>
            <span className='sr-only'>Loading...</span>
        </Spinner>
    )
}

export default Loading
