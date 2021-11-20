import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, ButtonGroup, Dropdown, DropdownButton, Badge } from 'react-bootstrap';
import { faEye, faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import ShareWithModal from './ShareWithModal';
import DeleteModal from './DeleteModal';
import RevokeAccessModal from './RevokeAccessModal';

const Gallery = (props) => {

    let userId = localStorage.getItem('userId');

    const [images, setImages] = useState([]);
    const [shareWithModalShow, setShareWithModalShow] = useState(false); // To show/hide the share modal
    const [deleteModalShow, setDeleteModalShow] = useState(false); // To show/hide the delete modal
    const [selectedImage, setSelectedImage] = useState(""); // To send the selected image to the modal
    const [deleteForAll, setDeleteForAll] = useState(false); // This is used so that the same delete modal can be used for both options
    const [revokeModalShow, setRevokeModalShow] = useState(false);

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

        axios.get(`http://sharestead-env-2.eba-mbvpyjui.eu-west-3.elasticbeanstalk.com/image/fetch/${email}`, {
            headers: headers
        }).then(response => {
            setImages(response.data.payload);
        }).catch(error => console.log(error.message));
    }

    const showShareWithModal = url => {
        setSelectedImage(url);
        setShareWithModalShow(true);
    }

    const showDeleteModal = (filename, e) => {
        setSelectedImage(filename);

        if (e.target.name === "3")
            setDeleteForAll(true);
        else
            setDeleteForAll(false);
        
        setDeleteModalShow(true);
    }

    const revokeModalClick = (filename) => {
        setSelectedImage(filename);
        setRevokeModalShow(true);
    }

    return (
        <div>
            <Container>
                <Row>
                    {images.length > 0 ? images.map(image => (
                        <Col key={image.id} lg={4} md={6} sm={12}>
                            <Card style={{ marginBottom: '20px', borderRadius: '10px' }}>
                            <Badge style={{ "display": image.sharedImage ? "block" : "none" }} className="ms-auto" bg="danger">Shared Image</Badge>
                                <Card.Img className="mx-auto" style={{ width: '90%', height: '250px', objectFit: 'contain' }} variant="top"
                                    src={`http://sharestead-env-2.eba-mbvpyjui.eu-west-3.elasticbeanstalk.com/image/${userId}/display/${image.url}`}
                                />
                                <Card.Body>
                                    <Card.Title>{image.metadata.originalFileName}</Card.Title>
                                    <Card.Text>
                                        <strong>Image Size:</strong> {image.metadata.imgSize} bytes <br />
                                        <strong>Date uploaded:</strong> {image.metadata.dateCreated}
                                    </Card.Text>
                                    <div style={{ textAlign: 'left' }}>
                                        <ButtonGroup size="sm">
                                            <Button onClick={() => { window.open(`http://sharestead-env-2.eba-mbvpyjui.eu-west-3.elasticbeanstalk.com/image/${userId}/display/${image.url}`, '_blank').focus() }}>
                                                <FontAwesomeIcon icon={faEye} /> View
                                            </Button>
                                            <Button onClick={() => { window.open(`http://sharestead-env-2.eba-mbvpyjui.eu-west-3.elasticbeanstalk.com/image/${userId}/download/${image.url}`, '_blank').focus() }}>
                                                <FontAwesomeIcon icon={faDownload} /> Download
                                            </Button>

                                            <DropdownButton as={ButtonGroup} title="More Options" id="bg-nested-dropdown">
                                                <Dropdown.Item eventKey="1" onClick={() => showShareWithModal(image.url)}>Share</Dropdown.Item>
                                                <Dropdown.Item eventKey="2" onClick={(e) => showDeleteModal(image.url, e)}>Delete For Me</Dropdown.Item>
                                                <Dropdown.Item eventKey="3" name="3" onClick={(e) => showDeleteModal(image.url, e)}>Delete For All</Dropdown.Item>
                                                <Dropdown.Item eventKey="4" name="4" onClick={() => revokeModalClick(image.url)}>Revoke Access</Dropdown.Item>
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
            <ShareWithModal filename={selectedImage} show={shareWithModalShow} onHide={() => setShareWithModalShow(false)} />
            <DeleteModal deleteforall={deleteForAll} filename={selectedImage} show={deleteModalShow} onHide={() => setDeleteModalShow(false)} />
            <RevokeAccessModal filename={selectedImage} show={revokeModalShow} onHide={() => setRevokeModalShow(false)} />
        </div>
    )
}

export default Gallery
