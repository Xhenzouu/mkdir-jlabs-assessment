import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import Card from "../components/Card";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Redirect to home if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/home", { replace: true });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      onLogin?.(); // Notify App
      navigate("/home", { replace: true });
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="container">
      <Card>
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        {error && <p className="error-text">{error}</p>}
      </Card>
    </div>
  );
}