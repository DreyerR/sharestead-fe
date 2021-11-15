import React from 'react'
import { Navigate } from 'react-router'

const Gallery = (props) => {

    if (!props.loggedIn) {
        return <Navigate to="/login" />
    }

    return (
        <div className="text-black">
            Gallery
        </div>
    )
}

export default Gallery
