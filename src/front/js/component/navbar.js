import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "../../styles/navbar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faMagnifyingGlass, faUser, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import TapNewsLogo from '../../../../public/tapnewslogo.png';
import { Context } from "../store/appContext";
import { Modal } from "react-bootstrap";
import FiltroModal from "./FiltroModal";


const NavbarBottom = () => {
  const [userId, setUserId] = useState(false);
  const { store, actions } = useContext(Context);
   const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setUserId(store.activeSession);
  }, [store.activeSession]);

  useEffect(() => {
    actions.activateSession()
  }, [])

  return (
    <Navbar className="navbar-fixed-bottom">
      <Container fluid>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="d-flex justify-content-evenly w-100">
            <Nav.Link as={Link} to="/profile">
              <FontAwesomeIcon size="2xl" icon={faUser} style={{ color: "#FFFFFF" }} className="nav-icon" />
            </Nav.Link>
            {userId && (
              <Nav.Link as={Link} to="/friends">
                <FontAwesomeIcon size="2xl" icon={faUserGroup} style={{ color: "#FFFFFF" }} className="nav-icon" />
              </Nav.Link>
            )}
            <Nav.Link as={Link} to="/">
              <img className="logo" src={TapNewsLogo} alt="TapNews Logo" />
            </Nav.Link>
            <Nav.Link as={Link} to="/search">
              <FontAwesomeIcon size="2xl" icon={faMagnifyingGlass} style={{ color: "#FFFFFF" }} className="nav-icon" />
            </Nav.Link>
            <Nav.Link onClick={() => setShowModal(true)}>
              <FontAwesomeIcon size="2xl" icon={faFilter} style={{ color: "#FFFFFF" }} className="nav-icon" />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
      <FiltroModal
        showModal={showModal}
        closeModal={() => setShowModal(false)}
      />
    </Navbar>
  );
};

export default NavbarBottom;
