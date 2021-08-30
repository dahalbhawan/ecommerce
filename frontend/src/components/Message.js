import React from 'react'

import { Alert } from 'react-bootstrap'

function Message({ type, children }) {
    return (
        <Alert variant={type} style={{padding: '10px'}}>
            {children}
        </Alert>
    )
}

export default Message
