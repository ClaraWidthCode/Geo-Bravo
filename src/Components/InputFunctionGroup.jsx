// InputFunctionGroup.jsx
import React from "react";
import { FaTrash, FaRegPlusSquare } from "react-icons/fa";
import { Row, Col } from "react-bootstrap";
import MathInput from "./MathInput"; // tu componente de input matemático

const InputFunctionGroup = ({
  title,
  description,
  inputs,
  onChange,
  onAdd,
  onDelete,
  onSubmit,
  validator,
  errorMessage,
}) => {
  const handleSubmit = () => {
    onSubmit(validator, errorMessage);
  };

  return (
    <Col xs={12} sm={12} md={4}>
      <Row className="align-items-center p-3">
        <h5>{title}</h5>
        <p>{description}</p>

        {inputs.map((input) => (
          <Col xs={12} key={input.id} className="mb-2">
            <div className="text-placeholder">Escribe tu función:</div>
            <Row className="align-items-center">
              <Col xs={inputs.length > 1 ? 10 : 12}>
                <div
                  className={`input-graphic w-100 ${
                    input.error ? "input-error" : ""
                  }`}
                >
                  <MathInput
                    setValue={(value) => onChange(input.id, value)}
                    onChange={(e) => onChange(input.id, e.target.value)}
                  />
                </div>
              </Col>

              {inputs.length > 1 && (
                <Col xs={2}>
                  <button
                    onClick={() => onDelete(input.id)}
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
          <button onClick={onAdd} className="button-add-input">
            <FaRegPlusSquare size={25} /> Añadir otra función
          </button>
        </Col>

        <Col xs={12} className="mb-3">
          <button
            onClick={handleSubmit}
            className="button-graphic btn btn-primary w-100"
          >
            Graficar
          </button>
        </Col>
      </Row>
    </Col>
  );
};

export default InputFunctionGroup;
