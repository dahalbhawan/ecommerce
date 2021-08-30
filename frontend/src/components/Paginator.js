import React from 'react'

import { Pagination } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

function Paginator({ numPages, page, keyword='', isAdmin=false }) {
    if (keyword) {
        keyword = keyword.split('?keyword=')[1].split('&')[0]
    }
    return (
        numPages > 1 && 
            (<Pagination>
                {[...Array(numPages).keys()].map((x) => (
                    <LinkContainer 
                        key={x+1} 
                        to={!isAdmin ? `/?keyword=${keyword}&page=${x+1}` : `/admin/products/?keyword=${keyword}&page=${x+1}`}
                    >
                        <Pagination.Item active={(x+1) === page}>{x+1}</Pagination.Item>
                    </LinkContainer>
                ))}
            </Pagination>)
    )
}

export default Paginator
