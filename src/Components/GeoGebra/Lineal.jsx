import React, { useState, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaRegPlusSquare, FaTrash } from "react-icons/fa";
import { PiGraph } from "react-icons/pi";
import GeoGebraApplet from "./GeoGebraApplet";
import MathInput from "react-math-keyboard";
import { simplify, derivative, parse } from "mathjs";
import * as mathsteps from "mathsteps";

import "../../styles/AppletStyle.css";

/* ===================== Helpers ===================== */

const normalizeInput = (s) =>
  String(s ?? "")
    .replace(/\s+/g, "")
    .replace(/\u2212/g, "-")
    .replace(/·/g, "*");

const getSymbols = (node, set = new Set()) => {
  if (node && typeof node.forEach === "function") {
    node.forEach((child) => getSymbols(child, set));
  }
  if (node && node.isSymbolNode) set.add(node.name);
  return set;
};

const toCanonical = (a, b) => {
  const ax = a === 0 ? "" : a === 1 ? "x" : a === -1 ? "-x" : `${a}x`;
  const bx = b === 0 ? "" : b > 0 ? `+${b}` : `${b}`;
  const out = `${ax}${bx}`;
  return out || "0";
};

/** Trae pasos de simplificación usando mathsteps */
const getSimplificationSteps = (expr) => {
  // mathsteps espera una expresión algebraica tipo string
  // y devuelve un array de pasos ordered
  // Nota: soporta operaciones típicas: distribuir, combinar términos, etc.
  try {
    const steps = mathsteps.simplifyExpression(expr);
    // Formateamos para UI + consola
    return steps.map((s, idx) => ({
      index: idx + 1,
      before: s.oldNode.toString(),
      after: s.newNode.toString(),
      changeType: s.changeType,       // ej: COMBINE_LIKE_TERMS
      substeps: (s.substeps || []).map(ss => ({
        before: ss.oldNode.toString(),
        after: ss.newNode.toString(),
        changeType: ss.changeType,
      })),
    }));
  } catch (e) {
    console.log(`[Steps] Error: ${e?.message || e}`);
    return [];
  }
};

/** Valida si es lineal en x y devuelve info útil */
const checkLinear = (func) => {
  const result = {
    ok: false,
    original: String(func ?? ""),
    clean: "",
    simplified: "",
    d1: "",
    d2: "",
    symbols: [],
    canonical: "",
    a: null,
    b: null,
    error: null,
  };

  try {
    result.clean = normalizeInput(result.original);

    const parsed = parse(result.clean);
    const simplifiedNode = simplify(parsed);
    result.simplified = simplifiedNode.toString();

    const symbols = getSymbols(simplifiedNode);
    result.symbols = [...symbols];
    const soloX = symbols.size === 0 || (symbols.size === 1 && symbols.has("x"));
    if (!soloX) {
      console.log(`[LinearCheck] Variables no permitidas: ${result.symbols.join(", ")}`);
      return result;
    }

    const d1 = simplify(derivative(simplifiedNode, "x"));
    const d2 = simplify(derivative(d1, "x"));
    result.d1 = d1.toString();
    result.d2 = d2.toString();

    const isZeroSecondDerivative =
      d2 && d2.isConstantNode && Number(d2.value) === 0;

    let aVal = 0;
    let bVal = 0;
    try { aVal = Number(d1.evaluate({})); } catch (_) { }
    try { bVal = Number(simplifiedNode.evaluate({ x: 0 })); } catch (_) { }

    result.a = aVal;
    result.b = bVal;
    result.canonical = toCanonical(aVal, bVal);
    result.ok = isZeroSecondDerivative;

    console.log(`[LinearCheck] Original: ${result.original}`);
    console.log(`[LinearCheck] Clean: ${result.clean}`);
    console.log(`[LinearCheck] Simplified: ${result.simplified}`);
    console.log(`[LinearCheck] Symbols: ${result.symbols.join(", ") || "(none)"}`);
    console.log(`[LinearCheck] d1/dx: ${result.d1}`);
    console.log(`[LinearCheck] d2/dx2: ${result.d2}`);
    console.log(`[LinearCheck] Is linear? ${result.ok}`);
    console.log(`[LinearCheck] Canonical (ax+b): ${result.canonical}`);

    return result;
  } catch (e) {
    result.error = e?.message || String(e);
    console.log(`[LinearCheck] Error: ${result.error}`);
    return result;
  }
};

/* ===================== Componente ===================== */

const Lineal = () => {
  const [inputs, setInputs] = useState([{ id: 1, value: "", error: "" }]);
  const [ggbApplet, setGgbApplet] = useState(null);

  // Mapa de pasos por inputId: { [id]: Step[] }
  const [stepsMap, setStepsMap] = useState({});

  const handleLoad = useCallback((applet) => setGgbApplet(applet), []);

  const handleInputChange = (id, value) => {
    setInputs((prev) =>
      prev.map((inp) =>
        inp.id === id ? { ...inp, value, error: "" } : inp
      )
    );
  };

  const handleKeyboardInput = (id, value) => {
    handleInputChange(id, value);
  };

  const handleAddInput = () => {
    setInputs((prev) => [
      ...prev,
      { id: prev.length + 1, value: "", error: "" },
    ]);
  };

  const handleDeleteInput = (id) => {
    if (inputs.length > 1) {
      if (ggbApplet) {
        const appletObject = ggbApplet.getAppletObject();
        if (appletObject && appletObject.evalCommand) {
          appletObject.evalCommand(`Delete[f${id}]`);
        }
      }
      setInputs((prev) => prev.filter((i) => i.id !== id));
      setStepsMap((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  const handleButtonClick = () => {
    if (!ggbApplet) return;
    const appletObject = ggbApplet.getAppletObject();
    if (!appletObject || !appletObject.evalCommand) return;

    setInputs((prevInputs) =>
      prevInputs.map((input) => {
        if (!input.value) return input;

        const expr = normalizeInput(input.value);

        // 1) Obtener pasos de simplificación (para imprimir procedimiento)
        const steps = getSimplificationSteps(expr);
        // Logs del procedimiento
        console.log(`[Steps] Procedimiento para: ${input.value}`);
        steps.forEach((s) => {
          console.log(
            `  #${s.index} (${s.changeType})  ${s.before}  ->  ${s.after}`
          );
          if (s.substeps?.length) {
            s.substeps.forEach((ss, k) =>
              console.log(
                `     - sub${k + 1} (${ss.changeType}) ${ss.before} -> ${ss.after}`
              )
            );
          }
        });

        // Guardar pasos para UI
        setStepsMap((prev) => ({ ...prev, [input.id]: steps }));

        // 2) Validación lineal y graficación de simplificada
        const res = checkLinear(expr);
        if (res.ok) {
          const exprToPlot = res.simplified || expr;
          console.log(`[Plot] f${input.id}(x) = ${exprToPlot} | Canonical: ${res.canonical}`);
          appletObject.evalCommand(`f${input.id}(x)=${exprToPlot}`);
          return { ...input, error: "" };
        } else {
          return {
            ...input,
            error: "Por favor, ingresa una función lineal en x (ej. 2x+3).",
          };
        }
      })
    );
  };

  return (
    <Container fluid className="p-3 mb-5">
      <Row>
        <h3 className="title-graphic mb-5">
          <PiGraph size={50} /> Funciones Lineales
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
            {inputs.map((input) => {
              const steps = stepsMap[input.id] || [];
              return (
                <Col xs={12} key={input.id} className="mb-3">
                  <div className="text-placeholder">
                    Ingresa una función lineal (ej. 2x+3)
                  </div>
                  <Row className="align-items-center">
                    <Col xs={inputs.length > 1 ? 10 : 12}>
                      <div
                        className={`input-graphic w-100 ${input.error ? "input-error" : ""
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

                  {input.error && (
                    <div className="text-error">{input.error}</div>
                  )}

                  {/* === Render de Procedimiento (pasos) === */}
                  {steps.length > 0 && (
                    <div className="mt-2">
                      <div className="fw-bold">Procedimiento:</div>
                      <ol className="mb-2">
                        {steps.map((s) => (
                          <li key={s.index} style={{ marginBottom: 6 }}>
                            <div>
                              <small className="text-muted">
                                {s.changeType}
                              </small>
                            </div>
                            <div>
                              <code>{s.before}</code> → <code>{s.after}</code>
                            </div>
                            {s.substeps?.length > 0 && (
                              <ul style={{ marginTop: 4 }}>
                                {s.substeps.map((ss, k) => (
                                  <li key={k}>
                                    <small className="text-muted">
                                      {ss.changeType}
                                    </small>
                                    <div>
                                      <code>{ss.before}</code> →{" "}
                                      <code>{ss.after}</code>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </Col>
              );
            })}

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

export default Lineal;
