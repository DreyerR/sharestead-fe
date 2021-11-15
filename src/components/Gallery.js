import React, { useState, useEffect } from 'react';
// import { Navigate } from 'react-router';
import { Image } from 'react-bootstrap';
import axios from 'axios';

const Gallery = (props) => {

    const [images, setImages] = useState([]);

    useEffect(() => {
        let email = localStorage.getItem('email');
        let token = localStorage.getItem('token');

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }

        axios.get("http://192.168.3.228:8060/image/fetch/" + email, {
            headers: headers
        }).then(response => {
            console.log(response.data);
            setImages(response.data.payload);
        }).catch(error => console.log(error.message));
    }, []);

    // if (!props.loggedIn) {
    //     return <Navigate to="/login" />
    // }

    return (
        <>
            {images.map(image => (
                <div key={image.id}>
                    <p>{image.metadata.originalFileName}</p>
                    <Image name={image.url} src={"http://192.168.3.228:8060/image/18/display/" + image.url}
                    onClick={(e) => alert(e.target.name)} width="150px" height="150px" />
                </div>
            ))}
        </>
    )
}

export default Gallery
