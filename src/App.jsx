import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./config/router";
import CustomNavBar from "./Components/CustomNavbar";
import Footer from "./Components/Footer";

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <CustomNavBar />
        <AppRouter />
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;








