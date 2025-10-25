import React, { useState, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { PiGraph } from "react-icons/pi";
import GeoGebraApplet from "./GeoGebraApplet";
import MathInput from "react-math-keyboard";

import "../../styles/AppletStyle.css";

const TwoCurves = () => {
  const [inputs, setInputs] = useState([
    { id: 1, value: "", error: "" },
    { id: 2, value: "", error: "" },
  ]);
  const [ggbApplet, setGgbApplet] = useState(null);

  const handleLoad = useCallback((applet) => setGgbApplet(applet), []);

  const handleInputChange = (id, value) => {
    setInputs((prevInputs) =>
      prevInputs.map((input) =>
        input.id === id ? { ...input, value, error: "" } : input
      )
    );
  };

  const handleButtonClick = () => {
    let valid = true;

    setInputs((prevInputs) =>
      prevInputs.map((input) => {
        return { ...input, error: "" };
      })
    );

    if (!valid) {
      return; // No grafiques si alguna función no es válida
    }

    if (ggbApplet) {
      const appletObject = ggbApplet.getAppletObject();
      if (appletObject && appletObject.evalCommand) {
        inputs.forEach((input) => {
          if (input.value) {
            appletObject.evalCommand(`Delete[f${input.id}]`);
            appletObject.evalCommand(`f${input.id}(x)=${input.value}`);
          }
        });

        // Encontrar los puntos de intersección
        appletObject.evalCommand("Intersect[f1, f2]");
        const intersections = appletObject.getAllObjectNames("Point");

        // Calcular el área entre las curvas en cada intervalo
        for (let i = 0; i < intersections.length - 1; i++) {
          const lowerLimit = appletObject.getXcoord(intersections[i]);
          const upperLimit = appletObject.getXcoord(intersections[i + 1]);
          appletObject.evalCommand(
            `IntegralBetween[f1, f2, ${lowerLimit}, ${upperLimit}]`
          );
        }
      }
    }
  };

  return (
    <Container fluid className="p-3 mb-5">
      <Row>
        <h3 className="title-graphic mb-5">
          <PiGraph size={50} /> Área entre curvas
        </h3>
      </Row>
      <Row className="justify-content-center">
        <Col xs={12} sm={12} md={8} className="d-flex justify-content-center">
          <div className="ggb-container">
            <GeoGebraApplet onLoad={handleLoad} />
          </div>
        </Col>
        <Col xs={12} sm={12} md={4}>
          <Row className="align-items-center p-3">
            {inputs.map((input) => (
              <Col xs={12} key={input.id} className="mb-2">
                <div className="text-placeholder">
                  Ingresa una función (ej. 2x³+3x²+4x+5)
                </div>
                <Row className="align-items-center">
                  <Col xs={12}>
                    <div
                      className={`input-graphic w-100 ${
                        input.error ? "input-error" : ""
                      }`}
                    >
                      <MathInput
                        setValue={(value) => handleInputChange(input.id, value)}
                        onChange={(e) =>
                          handleInputChange(input.id, e.target.value)
                        }
                      />
                    </div>
                  </Col>
                </Row>
                {input.error && <div className="text-error">{input.error}</div>}
              </Col>
            ))}
            <Col xs={12} className="mt-3">
              <button
                onClick={handleButtonClick}
                className="button-graphic btn btn-primary w-100"
              >
                Graficar y Calcular Área
              </button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default TwoCurves;
