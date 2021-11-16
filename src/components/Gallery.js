import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import { faEye, faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

const Gallery = (props) => {

    let userId = localStorage.getItem('userId');

    const [images, setImages] = useState([]);

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

        axios.get(`http://192.168.3.228:8060/image/fetch/${email}`, {
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
                            <Card style={{ marginBottom: '20px', borderRadius: '10px' }}>
                                <Card.Img className="mx-auto" style={{ width: '90%', height: '250px', objectFit: 'contain' }} variant="top"
                                    src={`http://192.168.3.228:8060/image/${userId}/display/${image.url}`}
                                />
                                <Card.Body>
                                    <Card.Title>{image.metadata.originalFileName}</Card.Title>
                                    <Card.Text>
                                        <strong>Image Size:</strong> {image.metadata.imgSize} bytes <br />
                                        <strong>Date uploaded:</strong> {image.metadata.dateCreated}
                                    </Card.Text>
                                    <div style={{textAlign: 'center'}}>
                                        <ButtonGroup size="sm">
                                            <Button onClick={() => { window.open(`http://192.168.3.228:8060/image/${userId}/display/${image.url}`, '_blank').focus() }}>
                                                <FontAwesomeIcon icon={faEye} /> View
                                            </Button>
                                            <Button onClick={() => { window.open(`http://192.168.3.228:8060/image/${userId}/download/${image.url}`, '_blank').focus() }}>
                                                <FontAwesomeIcon icon={faDownload} /> Download
                                            </Button>

                                            <DropdownButton as={ButtonGroup} title="More Options" id="bg-nested-dropdown">
                                                <Dropdown.Item eventKey="1">Share</Dropdown.Item>
                                                <Dropdown.Item eventKey="2">Delete</Dropdown.Item>
                                            </DropdownButton>
                                        </ButtonGroup>
                                    </div>
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
