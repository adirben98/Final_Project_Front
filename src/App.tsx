import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Components/HomePage";
import Login from "./Components/Login";
import Register from "./Components/Register";
import ProfilePage from "./Components/ProfilePage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/" element={<HomePage />} />
        <Route path="profile/:name" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
};

export default App;
