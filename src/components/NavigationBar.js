import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap';
import { faSignInAlt, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

const Navigationbar = (props) => {

    let loggedIn = props.loggedIn;

    const userLinks = (
        <>
            <Nav.Item>
                <Link to={"gallery"} className="nav-link">Your Gallery</Link>
            </Nav.Item>
            <Nav.Item>
                <Link to={"upload"} className="nav-link">Upload Photos</Link>
            </Nav.Item>
        </>
    );

    const guestLinks = (
        <>
            <Nav.Item>
                <Link to={"login"} className="nav-link"><FontAwesomeIcon icon={faSignInAlt} /> Login</Link>
            </Nav.Item>
            <Nav.Item>
                <Link to={"register"} className="nav-link"><FontAwesomeIcon icon={faSave} /> Register</Link>
            </Nav.Item>
        </>
    );

    return (
        <Navbar style={{ backgroundColor: "#e2821d" }} variant="dark" expand="md">
            <Container>
                <Link to={""} className="navbar-brand">
                    ShareStead
                </Link>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {/* <Nav.Item>
                            <Link to={"welcome"} className="nav-link">Welcome</Link>
                        </Nav.Item> */}
                        {loggedIn ? userLinks : null}
                    </Nav>
                    <Nav className="navbar-right">
                        {loggedIn ?
                            <Nav.Item>
                                <Link to={""} onClick={props.signOutFunction} className="nav-link">Sign out</Link>
                            </Nav.Item> :
                            guestLinks
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Navigationbar
