import React from "react";
import { Link } from "react-router-dom";
import "./home.css";

export function Home() {
  return (
    <main className="lander">
      <section className="intro">
        <h1>Fuel Your Fitness</h1>
        <p>Premium supplements for strength, endurance, and recovery.</p>
        <Link to="/shop">Shop Best Sellers →</Link>
      </section>
      <section className="rawtext">
        <h1>OPTIMISE.</h1>
        <h1>EVERYTHING.</h1>
      </section>
    </main>
  );
}
