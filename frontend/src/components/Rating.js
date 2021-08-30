import React from 'react'

//import styles
import '../styles/components/Rating.css'

function Rating({ value, text, color }) {
    const renderStars = () => {
        let stars = []
        let starCounter = value
        for (let i=1; i<=5; i++) {
            if (starCounter <= 0 ) {
                stars.push(<i key={i} style={{ color }} className="far fa-star"></i>)
            } else if (starCounter <= 0.5){
                stars.push(<i key={i} style={{ color }} className="fas fa-star-half-alt"></i>)
            } else {
                stars.push(<i key={i} style={{ color }} className="fas fa-star"></i>)
            }
            starCounter -= 1
        }
        return stars
    }
    return (
        <div className='rating'>
            <span>
                {
                    renderStars()
                }
            </span>
            {text && <small className="text-muted">  ({text})</small>}
        </div>
    )

}

export default Rating
