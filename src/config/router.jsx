import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/homePage.jsx";
import Lineal from "../Components/GeoGebra/Lineal.jsx";
import Quadratic from "../Components/GeoGebra/Quadratic.jsx";
import Cubic from "../Components/GeoGebra/Cubic.jsx";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/GeoBravo" element={<HomePage />} />
      <Route path="/GeoBravo/Lineal" element={<Lineal />} />
      <Route path="/GeoBravo/Quadratic" element={<Quadratic />}></Route>
      <Route path="/GeoBravo/Cubic" element={<Cubic />}></Route>
    </Routes>
  );
};

export default AppRouter;
