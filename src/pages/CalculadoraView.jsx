import React, { useState } from "react";
import MathKeyboardInput from "../Components/MathKeyboardInput";

const CalculadoraView = () => {
  const [valor, setValor] = useState("");

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: "0 16px" }}>
      <h2 style={{ marginBottom: 16 }}>Vista Calculadora</h2>

      <MathKeyboardInput
        label="Función a graficar"
        placeholder="Ej: 2x+3"
        value={valor}
        setValue={setValor}
      />

      
    </div>
  );
};

export default CalculadoraView;
