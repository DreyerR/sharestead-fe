import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { faRedo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import CustomToast from './CustomToast'

function RenameModal(props) {

    const [photoName, setPhotoName] = useState("");
    const [disableButton, setDisableButton] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [success, setSuccess] = useState(true);
    const [toastMessage, setToastMessage] = useState("");

    const handleSubmit = e => {
        e.preventDefault();

        setDisableButton(true);
        handlePostRequest();
    }

    const handlePostRequest = () => {
        let email = localStorage.getItem('email');
        let token = localStorage.getItem('token');

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }

        axios.put(`http://sharestead-env-2.eba-mbvpyjui.eu-west-3.elasticbeanstalk.com/metadata/update/${email}/`, null, {
            headers: headers
        }).then(response => {
            setSuccess(true);
            if (response.status === 200) {
                setToastMessage(response.data.message);
            }
        }).catch(error => {
            console.log(error.message);
            setSuccess(false);
        });

        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 2000);

        setDisableButton(false);
    }

    const handleInputChange = e => {
        setPhotoName(e.target.value);
    }

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Rename
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label>New photo name:</Form.Label>
                    <Form.Control type="text" placeholder="Enter new name" name="rename"
                        onChange={handleInputChange} values={photoName} required />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={handleSubmit} disabled={disableButton}>
                    <FontAwesomeIcon icon={faRedo} /> {disableButton ? 'Please wait...' : 'Rename'}
                </Button>
            </Modal.Footer>
            <div style={{ "display": showToast ? "block" : "none" }}>
                <CustomToast success={success} message={toastMessage} />
            </div>
        </Modal>
    )
}

export default RenameModal

