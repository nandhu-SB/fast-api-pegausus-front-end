import React, { useState, useEffect, useRef } from "react";
import "./LandingPage.css"; // Import your CSS file
import AOS from "aos";
import "aos/dist/aos.css";
import Ticker from "./Ticker";
import PortfolioRisk from "./RiskAnalysis";
import { Link } from "react-router-dom";

const Firstpage = () => {
  const [titleVisible, setTitleVisible] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const correctPassword = "1234"; // Change this to your desired password
  const aboutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      setTitleVisible(window.scrollY <= 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1000, once: false, mirror: true });
  }, []);

  const handlePasswordSubmit = () => {
    if (password === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password! Please try again.");
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handlePasswordSubmit();
    }
  };

  return (
    <>
      <div className="landing-page">
        <div
          className="title-container"
          style={{
            transform: titleVisible
              ? `translateY(${scrollPosition * 0.5}px)`
              : "translateY(-100%)",
            opacity: titleVisible ? 1 : 0,
          }}
        >
          <h1>PEGASUS TOOLBOX</h1>
          <p>A MOAT PMS INITIATIVE</p>
          <div className="features">
            <button
              onClick={() =>
                aboutRef.current.scrollIntoView({ behavior: "smooth" })
              }
            >
              About Us
            </button>

            <button>
              <Link to="./stocksearch">Stock Search</Link>
            </button>
          </div>
        </div>

        <div className="content-container">
          <section className="section" ref={aboutRef}>
            <h2>About Us</h2>
            <div className="sections-cards-container">
              <div className="section-cards" data-aos="fade-up-left">
                <p>
                  Established in 2013, Moat is owned and controlled by its
                  skilled and seasoned management team, who have worked together
                  closely over decades and continue to do so even today with the
                  same investment philosophy and a clear alignment of interest!
                </p>
              </div>
            </div>
          </section>

          <section className="section">
            <h2>Mission</h2>
            <div className="section-cards-container">
              <div className="section-cards" data-aos="fade-up-left">
                <p>
                  Empowering our clients to achieve financial growth and
                  prosperity by leveraging the wealth-generation potential of
                  Indian equities.
                </p>
              </div>
            </div>
          </section>

          <section className="section">
            <h2>Portfolio Risk</h2>
            <h4>What if we have a bad year?</h4>
            <div className="section-cards-container">
              <div className="section-cards" data-aos="fade-up-left">
                <p>
                  The market is inherently unpredictable, with fluctuations that
                  can occur in any direction...
                </p>
                <PortfolioRisk />
              </div>
            </div>
          </section>

          <section className="section">
            <h2>60-40 Strategy</h2>
            <h4>Balanced Investment for Long-Term Wealth Creation</h4>
            <div className="section-cards-container">
              <div className="section-cards" data-aos="fade-up-left">
                <p>
                  Our strategy is designed to safeguard wealth, maximize growth,
                  and harness the power of compounding...
                </p>
              </div>
            </div>
          </section>

          <section className="section">
            <h2>Contact Us</h2>
            <div className="section-class-container">
              <div className="section-cards" data-aos="fade-up-left">
                <p>
                  Room No: 3-I, 3rd Floor, National Pearl Star, Behind
                  Changampuzha Park Metro Station, Edappally, Kochi - 682024,
                  Kerala, India. Phone: +91 (0)484 4039561
                </p>
              </div>
            </div>
          </section>

          <div style={{ height: "500px" }}></div>
        </div>
      </div>
    </>
  );
};

export default Firstpage;
