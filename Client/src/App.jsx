import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./Style.css";
import Register from "./Auth/Register";
import Login from "./Auth/Login";
import Verify from "./Auth/Verify";
import Homepage from "./Pages/Homepage";
import Myprofile from "./Pages/Myprofile";
import EditProfile from "./Auth/EditProfile";
import Profile from "./Pages/Profile";
import Film from "./Pages/Film";
import WatchList from "./Pages/WatchList";
import { useAuth } from "./Contexts/AuthContext";
import Search from "./Pages/Search";

export const App = () => {
  const { isAuthenticated, userData, loading } = useAuth();
  const [authLoaded, setAuthLoaded] = useState(false);

  // Ensure authentication context is loaded before rendering protected routes
  useEffect(() => {
    if (!loading) {
      setAuthLoaded(true);
    }
  }, [loading]);

  if (!authLoaded) {
    return <div>Loading...</div>; // Placeholder until authentication context is loaded
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" /> : <Register />}
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/myprofile" />}
        />
        <Route
          path="/verify"
          element={isAuthenticated && userData.verified === false ? <Verify /> : <Navigate to="/" />}
        />
        <Route
          path="/myprofile"
          element={isAuthenticated ? <Myprofile /> : <Navigate to="/login" />}
        />
        <Route
          path="/myprofile/edit"
          element={isAuthenticated ? <EditProfile /> : <Navigate to="/login" />}
        />
        <Route
          path="/myprofile/watchlist"
          element={isAuthenticated ? <WatchList /> : <Navigate to="/login" />}
        />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/film/:filmId" element={<Film />} />
        <Route path='/search/:searchedFilm' element={<Search />} />
      </Routes>
    </Router>
  );
};

export default App;
