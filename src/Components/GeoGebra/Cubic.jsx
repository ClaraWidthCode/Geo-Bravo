import React, { useState, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaRegPlusSquare, FaTrash } from "react-icons/fa";
import { PiGraph } from "react-icons/pi";
import GeoGebraApplet from "./GeoGebraApplet";
import MathInput from "react-math-keyboard";

import "../../styles/AppletStyle.css";

const Cubic = () => {
  const [inputs, setInputs] = useState([{ id: 1, value: "", error: "" }]);
  const [ggbApplet, setGgbApplet] = useState(null);

  const handleLoad = useCallback((applet) => setGgbApplet(applet), []);

  const handleInputChange = (id, value) => {
    setInputs((prevInputs) =>
      prevInputs.map((input) =>
        input.id === id ? { ...input, value, error: "" } : input
      )
    );
  };

  const isCubicFunction = (func) => {
    const terms = func.replace(/\s+/g, "").split(/(?=[+-])/);
    const hasCubicTerm = terms.some((term) => /x\^3/.test(term));
    return (
      hasCubicTerm && terms.every((term) => /^[+-]?\d*x?(\^3|\^2)?$/.test(term))
    );
  };

  const handleButtonClick = () => {
    if (ggbApplet) {
      const appletObject = ggbApplet.getAppletObject();
      if (appletObject && appletObject.evalCommand) {
        setInputs((prevInputs) =>
          prevInputs.map((input) => {
            if (input.value) {
              if (isCubicFunction(input.value)) {
                appletObject.evalCommand(`f${input.id}(x)=${input.value}`);
                return { ...input, error: "" };
              } else {
                return {
                  ...input,
                  error: "Por favor, ingresa una función cúbica.",
                };
              }
            }
            return input;
          })
        );
      }
    }
  };

  const handleAddInput = () => {
    setInputs((prevInputs) => [
      ...prevInputs,
      { id: prevInputs.length + 1, value: "", error: "" },
    ]);
  };

  const handleKeyboardInput = (id, value) => {
    handleInputChange(id, value);
  };

  const handleDeleteInput = (id) => {
    if (inputs.length > 1) {
      if (ggbApplet) {
        const appletObject = ggbApplet.getAppletObject();
        if (appletObject && appletObject.evalCommand) {
          appletObject.evalCommand(`Delete[f${id}]`);
        }
      }
      setInputs((prevInputs) => prevInputs.filter((input) => input.id !== id));
    }
  };

  return (
    <Container fluid className="p-3 mb-5">
      <Row>
        <h3 className="title-graphic mb-5">
          <PiGraph size={50} /> Funciones Cúbicas
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
                  Ingresa una función cúbica (ej. 2x³+3x²+4x+5)
                </div>
                <Row className="align-items-center">
                  <Col xs={inputs.length > 1 ? 10 : 12}>
                    <div
                      className={`input-graphic w-100 ${
                        input.error ? "input-error" : ""
                      }`}
                    >
                      <MathInput
                        setValue={(value) =>
                          handleKeyboardInput(input.id, value)
                        }
                        onChange={(e) =>
                          handleInputChange(input.id, e.target.value)
                        }
                      />
                    </div>
                  </Col>
                  {inputs.length > 1 && (
                    <Col xs={2}>
                      <button
                        onClick={() => handleDeleteInput(input.id)}
                        className="button-delete-input"
                      >
                        <FaTrash size={20} />
                      </button>
                    </Col>
                  )}
                </Row>
                {input.error && <div className="text-error">{input.error}</div>}
              </Col>
            ))}
            <Col xs={12} className="d-flex justify-content-start mb-3">
              <button onClick={handleAddInput} className="button-add-input">
                <FaRegPlusSquare size={25} /> Añadir otra función
              </button>
            </Col>
            <Col xs={12} className="mb-3">
              <button
                onClick={handleButtonClick}
                className="button-graphic btn btn-primary w-100"
              >
                Graficar
              </button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Cubic;
