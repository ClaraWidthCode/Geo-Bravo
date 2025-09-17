import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/homePage.jsx";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/GeoBravo" element={<HomePage />} />
    </Routes>
  );
};

export default AppRouter;
