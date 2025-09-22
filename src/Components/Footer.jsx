import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";

import "../styles/FooterStyle.css";

import logo1 from "../assets/PascualBravo.png";
import logo2 from "../assets/GeoGebra.png";

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="justify-content-center align-items-center text-center">
          {/* Columna del primer logo */}
          <Col xs={6} sm={6} md={6} lg={5}>
            <Image
              fluid
              src={logo1}
              alt="Logo 1"
              width={300}
              height={80}
              className="footer-logo"
            />
          </Col>

          {/* Columna del segundo logo */}
          <Col xs={12} sm={6} md={6} lg={5}>
            <Image
              fluid
              src={logo2}
              alt="Logo 2"
              width={200}
              height={100}
              className="footer-logo"
            />
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
