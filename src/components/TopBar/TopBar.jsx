import { Link } from "react-router-dom";
import {useNavigate} from 'react-router-dom'
import "./TopBar.css";

export default function TopBar() {
const navigate=useNavigate();

  return (
    <header className="header">
      <div className="header-container">

        <div className="logo">
          <span>🛍️</span>
          <h2>ShopSmart</h2>
        </div>

        <nav>
          <Link to="/about">About</Link>
          <button onClick={()=>{navigate('/login')}}>Login</button>
        </nav>

      </div>
    </header>
  );
}