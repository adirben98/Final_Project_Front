import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Components/HomePage";
import Login from "./Components/Login";
import Register from "./Components/Register";
import ProfilePage from "./Components/ProfilePage";
import HeaderLayout from "./Components/HeaderLayout";
import NotFound from "./Components/NotFound";
import BookReview from "./Components/BookReview";
import Book from "./Components/Book";
import AllHeroes from "./Components/AllHeroes";
import AllBooks from "./Components/AllBooks";
import SearchPage from "./Components/SearchPage";
import CreateBook from "./Components/CreateBook";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route element={<HeaderLayout />}>
          <Route path="/heroes" element={<AllHeroes />} />
          <Route path="/books" element={<AllBooks />} />
          <Route path="/" element={<HomePage />} />
          <Route path="bookReview/:id" element={<BookReview />} />
          <Route path="/book/:id" element={<Book />}></Route>
          <Route path="profile/:name" element={<ProfilePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path ="/create" element={<CreateBook />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
