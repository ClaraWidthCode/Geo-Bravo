import React, { useState } from "react";
import MathInput from "react-math-keyboard";

const MathKeyboardInput = ({
  label = "Ingresa una función",
  placeholder = "Ej: 2x+3",
  value,
  setValue,
}) => {
  

  return (
    <div>
      {/* 🔹 MathInput en lugar del input normal */}
      <MathInput
        value={value}
        setValue={setValue}
        placeholder={placeholder}
      />
    </div>
  );
};

export default MathKeyboardInput;
