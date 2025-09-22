import React from "react";
import { Container, Row } from "react-bootstrap";

import "../styles/HomePageStyle.css";

import FeatureCard from "../Components/FeatureCard";

import worldProblems from "../assets/word_problems.gif";
import solutionStep from "../assets/solution-steps.gif";
import calculators from "../assets/calculators.gif";
import geometry from "../assets/geometry.gif";
import graphing from "../assets/graphing.gif";

import worldProblemsPng from "../assets/word_problems.png";
import solutionStepPng from "../assets/solution-steps.png";
import calculatorsPng from "../assets/calculators.png";
import geometryPng from "../assets/geometry.png";
import graphingPng from "../assets/graphing.png";

const HomePage = () => {
  const features = [
    {
      title: "Funciones lineales",
      description:
        "Ingresa una función lineal para ver su representación gráfica en el plano cartesiano.",
      image: worldProblems,
      staticImage: worldProblemsPng,
      link: "/GeoBravo/Lineal",
    },
    {
      title: "Funciones Cuadráticas",
      description:
        "Ingresa una función cuadrática para ver su representación gráfica en el plano cartesiano.",
      image: calculators,
      staticImage: calculatorsPng,
      link: "/GeoBravo/Quadratic",
    },
    {
      title: "Funciones Cúbicas",
      description:
        "Ingresa una función cúbica para ver su representación gráfica en el plano cartesiano.",
      image: geometry,
      staticImage: geometryPng,
      link: "/GeoBravo/Cubic",
    },
    {
      title: "Área bajo la curva",
      description: "Calcula el área bajo una función gráfica.",
      image: graphing,
      staticImage: graphingPng,
      link: "/GeoBravo/OneCurve",
    },
    {
      title: "Área entre curvas",
      description: "Determina el área entre dos funciones gráficas.",
      image: solutionStep,
      staticImage: solutionStepPng,
      link: "/GeoBravo/TwoCurves",
    },
  ];

  return (
    <Container className="container-home">
      <Row className="justify-content-center">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            image={feature.image}
            staticImage={feature.staticImage}
            link={feature.link}
          />
        ))}
      </Row>
    </Container>
  );
};

export default HomePage;
