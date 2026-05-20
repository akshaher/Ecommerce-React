import { useState, useActionState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./login.css";
import { fetchUserCart } from "../../store/cartStore";

const BASE_URL = "http://localhost:5000/";

const initialState = {
  errors: {
    username: "",
    email: "",
    password: "",
    general: "",
  },
  values: {
    username: "",
    email: "",
    password: "",
  },
};

function Login() {
  const [loginMode, setLoginMode] = useState(true);
  const navigate = useNavigate();

  async function loginAction(prevState, formData) {
    console.log(prevState,formData.get("username"), formData);
    
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    // Preserve submitted values so fields don't clear on error
    const values = { username, email, password };

    const errors = {
      username: "",
      email: "",
      password: "",
      general: "",
    };

    let hasError = false;

    if (!loginMode && !username.trim()) {
      errors.username = "Username is required";
      hasError = true;
    }

    if (!email.trim()) {
      errors.email = "Email is required";
      hasError = true;
    }

    if (!password.trim()) {
      errors.password = "Password is required";
      hasError = true;
    }else if (password.length < 6){
      errors.password ="Password must be at least 6 chracters";
      hasError=true;
    }

    if (hasError) {
      return { errors, values };
    }

    const url = loginMode ? BASE_URL + "login" : BASE_URL + "signup";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();      

      if (!response.ok) {
        return {
          errors: {
            ...errors,
            general: data.message || "Something went wrong. Please try again.",
          },
          values,
        };
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("username",data.username);
      await fetchUserCart();
      navigate("/products");
      return { errors, values };
    } catch (error) {
      console.log(error);
      return {
        errors: {
          ...errors,
          general: "Unable to connect to server. Please try again later.",
        },
        values,
      };
    }
  }

  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/products" replace />;
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <form action={formAction} className="auth-form">
          <h2>{loginMode ? "Welcome Back" : "Create Account"}</h2>

          <p className="subtitle">
            {loginMode
              ? "Login to continue shopping"
              : "Join us and start shopping"}
          </p>

          {!loginMode && <div className="field-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              defaultValue={state.values.username}
              key={state.values.username + "username"}
            />
            {state.errors.username && (
              <span className="field-error">{state.errors.username}</span>
            )}
          </div>}
          

          <div className="field-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              defaultValue={state.values.email}
              key={state.values.email + "email"}
            />
            {state.errors.email && (
              <span className="field-error">{state.errors.email}</span>
            )}
          </div>

          <div className="field-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              defaultValue={state.values.password}
              key={state.values.password + "password"}
            />
            {state.errors.password && (
              <span className="field-error">{state.errors.password}</span>
            )}
          </div>

          {state.errors.general && (
            <div className="auth-error-message">{state.errors.general}</div>
          )}

          <button type="submit" >
            { loginMode ? "Login" : "Sign Up"}
          </button>

          <p className="toggle-text">
            {loginMode ? "Don't have an account?" : "Already have an account?"}
            <span onClick={() => setLoginMode((prev) => !prev)}>
              {loginMode ? " Sign Up" : " Login"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
