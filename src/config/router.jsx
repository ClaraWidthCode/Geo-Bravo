import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/homePage.jsx";
import Lineal from "../Components/GeoGebra/Lineal.jsx";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/GeoBravo" element={<HomePage />} />
      <Route path="/GeoBravo/Lineal" element={<Lineal />} />
    </Routes>
  );
};

export default AppRouter;
