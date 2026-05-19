import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./login.css";
import { fetchUserCart } from "../../store/cartStore";

const BASE_URL = "http://localhost:5000/";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const token = localStorage.getItem("token");

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrorMessage("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setErrorMessage("");

    const url = isLogin ? BASE_URL + "login" : BASE_URL + "signup";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(
          data.message || "Something went wrong. Please try again.",
        );
        return;
      }
      localStorage.setItem("token", data.token);
      await fetchUserCart();
      navigate("/products");
    } catch (error) {
      console.log(error);

      setErrorMessage("Unable to connect to server. Please try again later.");
    }
  }

  if (token) {
    return <Navigate to="/products" replace />;
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>

          <p className="subtitle">
            {isLogin
              ? "Login to continue shopping"
              : "Join us and start shopping"}
          </p>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {errorMessage && (
            <div className="auth-error-message">{errorMessage}</div>
          )}

          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>

          <p className="toggle-text">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span
              onClick={() => {
                setIsLogin((prev) => !prev);
                setErrorMessage("");
              }}
            >
              {isLogin ? " Sign Up" : " Login"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
