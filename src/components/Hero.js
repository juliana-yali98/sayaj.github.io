import React, { useEffect, useRef } from 'react';
import './Hero.css';

function Hero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particles configuration
    const particles = [];
    const particleCount = 80;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = `rgba(79, 143, 111, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, i) => {
        particle.update();
        particle.draw();

        // Connect nearby particles
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.strokeStyle = `rgba(79, 143, 111, ${0.2 * (1 - distance / 150)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    }

    animate();

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleExploreClick = () => {
    const abstractSection = document.querySelector('.abstract-section');
    if (abstractSection) {
      abstractSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section">
      {/* Particles Canvas */}
      <canvas ref={canvasRef} className="particles-canvas"></canvas>
      
      {/* Animated Background Shapes */}
      <div className="animated-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Hero Content */}
      <div className="hero-content">
        {/* Virus Badge */}
        <div className="virus-badge">
          <span className="virus-icon">🦠</span>
          <span className="virus-text">ToBRFV Research</span>
        </div>
        
        {/* Main Title */}
        <h1 className="hero-title">
          Tomato Brown Rugose Fruit Virus
          <span className="title-highlight">(ToBRFV)</span>
        </h1>
        
        {/* Subtitle */}
        <p className="hero-subtitle">
          Distribution, transmission and protein interactions in tomato and pepper
        </p>

        {/* Statistics */}
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

        {/* CTA Button */}
        <button className="hero-cta" onClick={handleExploreClick}>
          <span>Explore Results</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Scroll Indicator */}
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
