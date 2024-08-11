import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Components/HomePage";
import Login from "./Components/Login";
import Register from "./Components/Register";
import ProfilePage from "./Components/ProfilePage";
import SearchBar from "./Components/SearchBar";
import HeaderLayout from "./Components/HeaderLayout";
import NotFound from "./Components/NotFound";
import BookReview from "./Components/BookReview";
import Book from "./Components/Book";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route element={<HeaderLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="book/:id" element={<BookReview />} />
          <Route path="/newBook" element={<Book />}></Route>
          <Route path="profile/:name" element={<ProfilePage />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/search" element={<SearchBar />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
