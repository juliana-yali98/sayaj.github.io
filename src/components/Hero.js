import React from 'react';
import './Hero.css';

function Hero() {

  const handleExploreClick = () => {
    const abstractSection = document.querySelector('.abstract-section');
    if (abstractSection) {
      abstractSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section">

      {/* 🎥 Background Video */}
      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={`${process.env.PUBLIC_URL}/hero-video.mp4`} type="video/mp4" />
      </video>

      {/* Dark Overlay for readability */}
      <div className="video-overlay"></div>

      {/* Hero Content */}
      <div className="hero-content">
        
        <div className="virus-badge">
          <span className="virus-icon">🦠</span>
          <span className="virus-text">ToBRFV Research</span>
        </div>
        
        <h1 className="hero-title">
          Tomato Brown Rugose Fruit Virus
          <span className="title-highlight">(ToBRFV)</span>
        </h1>
        
        <p className="hero-subtitle">
          Distribution, transmission and protein interactions in tomato and pepper
        </p>

        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-icon">🎯</div>
            <div className="stat-number">19/20</div>
            <div className="stat-label">Positive Fields</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-icon">📍</div>
            <div className="stat-number">8</div>
            <div className="stat-label">Municipalities</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-icon">🧬</div>
            <div className="stat-number">99.9%</div>
            <div className="stat-label">Nucleotide Identity</div>
          </div>
        </div>

        <button className="hero-cta" onClick={handleExploreClick}>
          <span>Explore Results</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <p className="scroll-text">Scroll to explore</p>
        </div>

      </div>
    </section>
  );
}

export default Hero;

