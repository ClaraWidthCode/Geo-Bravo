import React, { useState } from "react";
import {  Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

import "../styles/CustomNavbarStyle.css";

const CustomNavbar = () => {
  const [expanded, setExpanded] = useState(false);
  const handleSelect = () => {
    setExpanded(false);
  };

  const navigate = useNavigate();
  const location = useLocation();
  // Con basename, la ruta principal es "/"
  const showBackButton = location.pathname.startsWith("/GeoBravo/") && location.pathname !== "/GeoBravo/";

  return (
    <>
      <Navbar expand={false} className="custom-navbar" expanded={expanded}>
        <Container>
          <Navbar.Brand
            as={Link}
            to="GeoBravo/"
            className="navbar-brand-custom"
            onClick={handleSelect}
          >
            Geobravo
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className="custom-icon"
            onClick={() => setExpanded(expanded ? false : true)}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto" onSelect={handleSelect}>
              <Nav.Link
                as={Link}
                to="GeoBravo/Lineal"
                className="nav-link-custom"
                onClick={handleSelect}
              >
                Funciones lineales
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="GeoBravo/Quadratic"
                className="nav-link-custom"
                onClick={handleSelect}
              >
                Funciones cuadráticas
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="GeoBravo/Cubic"
                className="nav-link-custom"
                onClick={handleSelect}
              >
                Funciones cúbicas
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="GeoBravo/OneCurve"
                className="nav-link-custom"
                onClick={handleSelect}
              >
                Área bajo la curva
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="GeoBravo/TwoCurves"
                className="nav-link-custom"
                onClick={handleSelect}
              >
                Área entre curvas
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Botón debajo del Navbar */}
      {showBackButton && (
        <Container fluid className="back-button-container">
          <Button
            className="back-button"
            onClick={() => navigate("/GeoBravo/")}
          >
            <IoIosArrowBack size={35} />
            Volver
          </Button>
        </Container>
      )}
    </>
  );
};

export default CustomNavbar;
