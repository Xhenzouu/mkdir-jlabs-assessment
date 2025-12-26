import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  // Listen for changes in localStorage (login/logout) from other components
  useEffect(() => {
    const handleStorage = () => {
      setIsLoggedIn(Boolean(localStorage.getItem("token")));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          isLoggedIn ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/home" replace /> : <Login onLogin={() => setIsLoggedIn(true)} />}
      />
      <Route
        path="/home"
        element={isLoggedIn ? <Home onLogout={() => setIsLoggedIn(false)} /> : <Navigate to="/login" replace />}
      />
      <Route
        path="*"
        element={<Navigate to={isLoggedIn ? "/home" : "/login"} replace />}
      />
    </Routes>
  );
}

export default App;