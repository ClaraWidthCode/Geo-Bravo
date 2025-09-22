import React from "react";
import AppRouter from "./config/router";
import CustomNavBar from "./Components/CustomNavbar";
import Footer from "./Components/Footer";

const App = () => {
  return (
    <div>
      <CustomNavBar />
      <AppRouter />
      <Footer />
    </div>
  );
};

export default App;
