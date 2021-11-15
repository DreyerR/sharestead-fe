import './App.css';
import { useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NavigationBar from './components/NavigationBar';
import Welcome from './components/Welcome';
import Photo from './components/Photo';
import Gallery from './components/Gallery';
import Register from './components/Register';
import Login from './components/Login';

function App() {

  const [loggedIn, setLoggedIn] = useState(false);

  const marginTop = {
    marginTop: "2%"
  }

  useEffect(() => {
      checkIfLoggedIn();
  });

  const checkIfLoggedIn = () => {
      if (localStorage.getItem('token') !== null) {
          setLoggedIn(true);
      }
  }

  const signOut = () => {
      localStorage.clear();
      setLoggedIn(false);
  }

  return (
    <Router>
      <NavigationBar loggedIn={loggedIn} signOutFunction={signOut} />

      <Container>
        <Row>
          <Col lg={12} style={marginTop}>
            <Routes>
              <Route path="/" exact element={<Welcome checkIfLoggedInFunc={checkIfLoggedIn} />} />
              {/* <Route path="/welcome" exact element={<Welcome />} /> */}
              <Route path="/upload" exact element={<Photo loggedIn={loggedIn} />} />
              <Route path="/gallery" exact element={<Gallery loggedIn={loggedIn} />} />
              <Route path="/register" exact element={<Register />} />
              <Route path="/login" exact element={<Login />} />
            </Routes>
          </Col>
        </Row>
      </Container>

    </Router>
  );
}

export default App;
