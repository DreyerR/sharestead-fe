import React from 'react'
import { Navigate } from 'react-router'

const Photo = (props) => {

    if (!props.loggedIn) {
        return <Navigate to="/login" />
    }

    return (
        <div className="text-black">
            Upload Image
        </div>
    )
}

export default Photo
