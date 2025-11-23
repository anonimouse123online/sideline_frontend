// src/pages/About.jsx
import React from "react";
import "./About.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"; // optional, if you want footer

export default function About() {
  return (
    <>
      <Navbar />

      <div className="about-page">
        <h1>About Us</h1>
        <p>
          Welcome to our platform! We are a small but passionate team dedicated to
          creating innovative solutions and providing the best experience for our users.
        </p>

        <h2>Our Mission</h2>
        <p>
          Our mission is to connect talented individuals with opportunities that
          match their skills and aspirations, making job searching easier, faster,
          and more accessible.
        </p>

        <h2>Meet the Team</h2>
        <div className="team-members">
          <div className="team-member">
            <h3>Kurt Paul C. Perocillo</h3>
            <p><strong>Founder & Lead Developer</strong></p>
            <p>
              Kurt Paul is the visionary behind this platform, responsible for the
              overall strategy, development, and direction of the project.
            </p>
          </div>

          <div className="team-member">
            <h3>Jen Bayking</h3>
            <p><strong>Co-Founder & Developer</strong></p>
            <p>
              Jen is the technical co-founder who contributes to the development,
              design, and implementation of key features, ensuring a smooth and
              efficient user experience.
            </p>
          </div>
        </div>

        <h2>Our Vision</h2>
        <p>
          We aim to become a trusted platform for connecting professionals with
          meaningful work, fostering growth and opportunity for all our users.
        </p>
      </div>

      <Footer /> {/* optional footer */}
    </>
  );
}
