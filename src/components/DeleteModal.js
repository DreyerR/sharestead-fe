import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CustomToast from './CustomToast'
import axios from 'axios'

function DeleteModal(props) {

    const [disableButton, setDisableButton] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [success, setSuccess] = useState(true);
    const [toastMessage, setToastMessage] = useState("");

    const handleSubmit = e => {
        e.preventDefault();

        setDisableButton(true);

        if (props.deleteforall) {
            deleteForAllPost();
        }
        else {
            deletePost();
        }
    }

    const deleteForAllPost = () => {
        let email = localStorage.getItem('email');
        let token = localStorage.getItem('token');

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }

        axios.delete(`http://sharestead-env-2.eba-mbvpyjui.eu-west-3.elasticbeanstalk.com/image/delete/all/${email}/${props.filename}`, {
            headers: headers
        }).then(response => {
            if (response.status === 200) {
                setToastMessage("Successfully deleted photo for all");
            }
        }).catch(error => {

            if (error.response.status === 405)
                setToastMessage("You don't have sufficient access to delete");
            else if (error.response.status === 404)
                setToastMessage("Image/member could not be found");
            else if (error.response.status === 500)
                setToastMessage(error.response.data.message);

            setSuccess(false);
        });

        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
            setDisableButton(false);
            window.location.reload();
            props.onHide();
        }, 2000);
    }

    const deletePost = () => {
        let email = localStorage.getItem('email');
        let token = localStorage.getItem('token');

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }

        axios.delete(`http://sharestead-env-2.eba-mbvpyjui.eu-west-3.elasticbeanstalk.com/image/delete/${email}/${props.filename}`, {
            headers: headers
        }).then(response => {
            if (response.status === 200) {
                setToastMessage("Successfully deleted photo");
            }
        }).catch(error => {

            if (error.response.status === 404)
                setToastMessage("Image could not be found");
            else
                setToastMessage(error.response.data.message);

            setSuccess(false);
        });

        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
            setDisableButton(false);
            window.location.reload();
            props.onHide();
        }, 2000);
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
                    Confirmation
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {!props.deleteforall ? <p>Are you sure you want to delete the photo?</p> :
                    <p>Are you sure you want to delete the photo for all members?</p>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleSubmit} disabled={disableButton}>
                    <FontAwesomeIcon icon={faTrash} /> {disableButton ? 'Please wait...' : 'Delete'}
                </Button>
            </Modal.Footer>
            <div style={{ "display": showToast ? "block" : "none" }}>
                <CustomToast success={success} message={toastMessage} />
            </div>
        </Modal>
    )
}

export default DeleteModal
