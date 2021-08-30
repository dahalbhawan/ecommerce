import React from 'react'
import Rating from './Rating'

function Review({ name, rating, comment, date }) {
    return (
        <div className='review'>
            <strong>{name}</strong>
            <Rating value={rating} color="#f8e825" />
            <small className="text-muted">{date}</small>
            <br></br>
            <p className="lead"><small>{comment}</small></p>
        </div>
    )
}

export default Review
