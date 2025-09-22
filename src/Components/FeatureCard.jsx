import React, { useState } from "react";
import { Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/FeatureCardStyle.css";

const FeatureCard = ({ title, description, image, staticImage, link }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Col xs={12} sm={6} md={4} className="mb-4">
      <Link to={link} style={{ textDecoration: "none" }}>
        <Card
          className="custom-card"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {image && (
            <Card.Img
              className="custom-img"
              variant="top"
              fluid
              src={isHovered ? image : staticImage} 
            />
          )}
          <Card.Body>
            <Card.Title>{title}</Card.Title>
            <Card.Text>{description}</Card.Text>
          </Card.Body>
        </Card>
      </Link>
    </Col>
  );
};

export default FeatureCard;
