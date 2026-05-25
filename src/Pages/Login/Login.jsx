import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./login.css";
import { fetchUserCart } from "../../store/cartStore";
import { GoogleLogin } from '@react-oauth/google';

const BASE_URL = "http://localhost:5000/";

function Login() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch(BASE_URL + "google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await response.json();    
        

      if (!response.ok) {
        setErrorMsg(data.message || "Google authentication failed.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      await fetchUserCart();
      navigate("/products");
    } catch (error) {
      console.log(error);
      setErrorMsg("Unable to connect to server. Please try again later.");
    }
  };

  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/products" replace />;
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome</h2>
        <p className="subtitle">Sign in to continue shopping</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              console.log('Login Failed');
              setErrorMsg("Google Sign-In was unsuccessful. Please try again.");
            }}
          />
        </div>

        {errorMsg && (
          <div className="auth-error-message" style={{ textAlign: "center", color: "red", marginTop: "1rem" }}>{errorMsg}</div>
        )}
      </div>
    </div>
  );
}

export default Login;

