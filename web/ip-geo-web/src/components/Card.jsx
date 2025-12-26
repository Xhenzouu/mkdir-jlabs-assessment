import React from "react";
import "../App.css";

export default function Card({ children, style }) {
  return (
    <div className="centered-card" style={style}>
      {children}
    </div>
  );
}