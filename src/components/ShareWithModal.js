import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { faShare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import CustomToast from './CustomToast'

function ShareWithModal(props) {

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
        let sharedBy = localStorage.getItem('email');
        let token = localStorage.getItem('token');
        var chk = document.getElementById('share-checkbox');

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }

        axios.post(`http://localhost:8060/image/share/${sharedBy}/${emailText}/${props.filename}?isModifiable=${chk.checked}`, null, {
            headers: headers
        }).then(response => {
            setSuccess(true);
            if (response.status === 200) {
                setToastMessage("Successfully shared photo");
            }
        }).catch(error => {
            console.log(error.response.data);
            if (error.response.status === 405)
                setToastMessage(error.response.data.message);
            else if (error.response.status === 404)
                setToastMessage("User could not be found");
            else
                setToastMessage("Photo is already shared with that user");

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
                    Share With
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label>Account to share with:</Form.Label>
                    <Form.Control type="email" placeholder="Enter email address" name="email"
                        onChange={handleInputChange} values={emailText} required />
                    <Form.Check className="mt-3" type="checkbox" id="share-checkbox"
                        label="Do you want the person to be able to modify the photo?" />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={handleSubmit} disabled={disableButton}>
                    <FontAwesomeIcon icon={faShare} /> {disableButton ? 'Please wait...' : 'Share'}
                </Button>
            </Modal.Footer>
            <div style={{ "display": showToast ? "block" : "none" }}>
                <CustomToast success={success} message={toastMessage} />
            </div>
        </Modal>
    )
}

export default ShareWithModal

