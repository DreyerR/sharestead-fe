import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import CustomToast from './CustomToast'

function RevokeAccessModal(props) {

    const [emailText, setEmailText] = useState("");
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
        let token = localStorage.getItem('token');

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }

        axios.put(`http://localhost:8060/image/revoke/${emailText}/${props.filename}`, null, {
            headers: headers
        }).then(response => {
            setSuccess(true);
            if (response.status === 200) {
                setToastMessage("Successfully revoked photo");
            }
        }).catch(error => {
            setToastMessage(error.response.data.message);
            setSuccess(false);
        });

        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 2000);

        setDisableButton(false);
    }

    const handleInputChange = e => {
        setEmailText(e.target.value);
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
                    Revoke
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label>Account to revoke:</Form.Label>
                    <Form.Control type="email" placeholder="Enter email address" name="email"
                        onChange={handleInputChange} values={emailText} required />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleSubmit} disabled={disableButton}>
                    <FontAwesomeIcon icon={faTimes} /> {disableButton ? 'Please wait...' : 'Revoke'}
                </Button>
            </Modal.Footer>
            <div style={{ "display": showToast ? "block" : "none" }}>
                <CustomToast success={success} message={toastMessage} />
            </div>
        </Modal>
    )
}

export default RevokeAccessModal

