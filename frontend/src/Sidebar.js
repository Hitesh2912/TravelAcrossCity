import React from "react";
import "./Sidebar.css";
import { FaTimes, FaUserTie, FaHotel, FaCarAlt, FaBookOpen, FaMapMarkerAlt } from "react-icons/fa";

function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <button className="close-btn" onClick={toggleSidebar}>
        <FaTimes />
      </button>

      <h2>PlanMyJourney</h2>

      <ul className="sidebar-menu">
        <li><FaUserTie /> Guide</li>
        <li><FaHotel /> Hotel</li>
        <li><FaBookOpen /> Mentor</li>
        <li><FaCarAlt /> Driver</li>
        <li><FaMapMarkerAlt /> Places</li>
      </ul>
    </div>
  );
}

export default Sidebar;
