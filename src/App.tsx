import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Components/HomePage";
import Login from "./Components/Login";
import Register from "./Components/Register";
import ProfilePage from "./Components/ProfilePage";
import NotFound from "./Components/NotFound";
import Background from "./Components/Background";

const App: React.FC = () => {
  return (
    <Background>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/" element={<HomePage />} />
          <Route path="profile/:name" element={<ProfilePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </Background>
  );
};

export default App;
