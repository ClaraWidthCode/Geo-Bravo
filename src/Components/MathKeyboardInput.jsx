import React, { useState } from "react";
import MathInput from "react-math-keyboard";

const MathKeyboardInput = ({
  label = "Ingresa una función",
  placeholder = "Ej: 2x+3",
  value,
  setValue,
}) => {
  const [mostrarTeclado, setMostrarTeclado] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {label && (
        <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
          {label}
        </label>
      )}

      {/* Input + botón */}
      <div style={{ display: "flex", gap: 10 }}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setMostrarTeclado(true)} // abre al enfocar
          style={{
            flex: 1,
            padding: "10px 12px",
            border: "1px solid #ccc",
            borderRadius: 6,
            outline: "none",
          }}
        />
        <button
          type="button"
          onClick={() => setMostrarTeclado((v) => !v)}
          style={{
            padding: "10px 14px",
            background: "#2563eb",
            color: "#fff",
            border: 0,
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {mostrarTeclado ? "Cerrar" : "Calc"}
        </button>
      </div>

      {/* Teclado matemático */}
      {mostrarTeclado && (
        <div style={{ marginTop: 12 }}>
          <MathInput value={value} setValue={setValue} />
        </div>
      )}
    </div>
  );
};

export default MathKeyboardInput;
