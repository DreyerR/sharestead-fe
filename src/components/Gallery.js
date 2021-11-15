import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const Gallery = (props) => {

    const [images, setImages] = useState([]);
    let userId = localStorage.getItem('userId');

    useEffect(() => {
        loadImages();
    }, []);

    const loadImages = () => {
        let email = localStorage.getItem('email');
        let token = localStorage.getItem('token');

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }

        axios.get(`http://localhost:8060/image/fetch/${email}`, {
            headers: headers
        }).then(response => {

            setImages(response.data.payload);
        }).catch(error => console.log(error.message));
    }

    return (
        <div>
            <Container>
                <Row>
                    {images.length > 0 ? images.map(image => (
                        <Col key={image.id} lg={4} md={6} sm={12}>
                            <Card style={{ marginBottom: '20px' }}>
                                <Card.Img className="mx-auto" style={{ width: '90%', height: '250px', objectFit: 'contain', cursor: 'pointer' }} variant="top"
                                    src={`http://localhost:8060/image/${userId}/display/${image.url}`} onClick={e => {window.open(e.target.src, '_blank').focus()}}  />
                                <Card.Body>
                                    <Card.Title>{image.metadata.originalFileName}</Card.Title>
                                    <Card.Text>
                                        <strong>Image Size:</strong> {image.metadata.imgSize} bytes <br />
                                        <strong>Date uploaded:</strong> {image.metadata.dateCreated}
                                    </Card.Text>
                                    <Button variant="primary">Share</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    )) : 
                        <h1 className="text-center">No images available</h1>
                    }
                </Row>
            </Container>
        </div>
    )
}

export default Gallery
