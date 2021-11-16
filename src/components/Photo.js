import React, { useMemo } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#000',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#000',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const activeStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

function Photo(props) {

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
        acceptedFiles,
        fileRejections,
        open
    } = useDropzone({ accept: 'image/*', noClick: true, noKeyboard: true });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject,
        isDragAccept
    ]);

    const acceptedFileItems = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    const fileRejectionItems = fileRejections.map(({ file, errors }) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
            <ul>
                {errors.map(e => (
                    <li key={e.code}>{e.message}</li>
                ))}
            </ul>
        </li>
    ));

    const uploadFiles = () => {

        let userId = localStorage.getItem('userId');
        let token = localStorage.getItem('token');

        const headers = {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + token
        }

        var formData = new FormData();
        acceptedFiles.map(file => (
            formData.append('file', file)
        ));

        axios.post(`http://192.168.3.228:8060/image/${userId}/upload`, formData, {
            headers: headers
        }).then(response => {
            if (response.status === 200) {
                alert('File(s) successfully uploaded');
            }
        }).catch(error => console.log(error.message));
    }

    return (
        <Card>
            <Card.Header style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                <FontAwesomeIcon icon={faUpload} style={{ color: '#e2821d' }} /> Upload Your Photos
            </Card.Header>
            <Card.Body>
                <div className="container">
                    <div {...getRootProps({ style })}>
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop some images here</p>
                        <em>Only images (.jpg, .png, .bmp, etc) will be accepted</em>
                        <Button className="btn btn-primary mt-3" onClick={open}>Click to upload files</Button>
                    </div>
                    <aside className="mt-3">
                        <h4>Accepted files</h4>
                        <ul>{acceptedFileItems}</ul>
                        <h4>Rejected files</h4>
                        <ul>{fileRejectionItems}</ul>
                    </aside>
                </div>
            </Card.Body>
            <Card.Footer>
                <div className="d-flex justify-content-end">
                    <Button variant="success" onClick={uploadFiles} >
                        <div><FontAwesomeIcon icon={faUpload} style={{ marginRight: '5px' }} />
                            Upload
                        </div>
                    </Button>
                </div>
            </Card.Footer>
        </Card>

    );
}

export default Photo
