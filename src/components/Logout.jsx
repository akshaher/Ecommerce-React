import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./logout.css";

export default function LogoutModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  // ESC key handler
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLogout = () => {
    // clear auth data (if any)
    localStorage.removeItem("token");

    onClose();
    navigate("/");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2>Confirm Logout</h2>
        <p>Are you sure you want to logout from the site?</p>

        <div className="modal-actions">
          <button className="btn cancel" onClick={onClose}>
            Cancel
          </button>

          <button className="btn logout" onClick={handleLogout}>
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  );
}