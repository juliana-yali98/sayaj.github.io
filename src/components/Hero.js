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
    const viruses = [];
    const virusCount = 25; // Less viruses since they're bigger
    const cells = []; // Plant cells in background
    const cellCount = 15;

    // Plant cell class (hexagonal cells in background)
    class PlantCell {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 30 + 40;
        this.opacity = Math.random() * 0.08 + 0.03;
        this.rotation = Math.random() * Math.PI / 3;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Cell wall
        ctx.strokeStyle = `rgba(79, 143, 111, ${this.opacity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const x = Math.cos(angle) * this.size;
          const y = Math.sin(angle) * this.size;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();

        // Cell membrane (smaller hexagon)
        ctx.strokeStyle = `rgba(79, 143, 111, ${this.opacity * 0.5})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const x = Math.cos(angle) * (this.size * 0.7);
          const y = Math.sin(angle) * (this.size * 0.7);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();

        ctx.restore();
      }
    }

    class Virus {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 8 + 5; // Virus core size
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
        this.opacity = Math.random() * 0.4 + 0.3;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.spikeCount = 8; // Virus spikes
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        this.pulsePhase += 0.03;

        // Wrap around screen
        if (this.x > canvas.width + 50) this.x = -50;
        if (this.x < -50) this.x = canvas.width + 50;
        if (this.y > canvas.height + 50) this.y = -50;
        if (this.y < -50) this.y = canvas.height + 50;
      }

      draw() {
        const pulse = Math.sin(this.pulsePhase) * 0.15 + 1;
        const currentSize = this.size * pulse;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Draw virus core (hexagonal capsid)
        ctx.fillStyle = `rgba(199, 58, 47, ${this.opacity * 0.8})`;
        ctx.strokeStyle = `rgba(242, 140, 40, ${this.opacity})`;
        ctx.lineWidth = 1.5;
        
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const x = Math.cos(angle) * currentSize;
          const y = Math.sin(angle) * currentSize;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Draw spike proteins
        ctx.strokeStyle = `rgba(79, 143, 111, ${this.opacity * 0.7})`;
        ctx.lineWidth = 2;
        
        for (let i = 0; i < this.spikeCount; i++) {
          const angle = (Math.PI * 2 / this.spikeCount) * i;
          const startX = Math.cos(angle) * currentSize;
          const startY = Math.sin(angle) * currentSize;
          const endX = Math.cos(angle) * (currentSize + 6);
          const endY = Math.sin(angle) * (currentSize + 6);
          
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();

          // Spike tip
          ctx.fillStyle = `rgba(79, 143, 111, ${this.opacity})`;
          ctx.beginPath();
          ctx.arc(endX, endY, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    // Create plant cells (background)
    for (let i = 0; i < cellCount; i++) {
      cells.push(new PlantCell());
    }

    // Create viruses
    for (let i = 0; i < virusCount; i++) {
      viruses.push(new Virus());
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw plant cells first (background layer)
      cells.forEach(cell => {
        cell.draw();
      });

      viruses.forEach((virus, i) => {
        virus.update();
        virus.draw();

        // Connect nearby viruses with RNA strands
        viruses.slice(i + 1).forEach(otherVirus => {
          const dx = virus.x - otherVirus.x;
          const dy = virus.y - otherVirus.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            const gradient = ctx.createLinearGradient(
              virus.x, virus.y, 
              otherVirus.x, otherVirus.y
            );
            gradient.addColorStop(0, `rgba(199, 58, 47, ${0.15 * (1 - distance / 200)})`);
            gradient.addColorStop(0.5, `rgba(242, 140, 40, ${0.2 * (1 - distance / 200)})`);
            gradient.addColorStop(1, `rgba(199, 58, 47, ${0.15 * (1 - distance / 200)})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5;
            ctx.setLineDash([5, 3]); // Dashed line for RNA appearance
            ctx.beginPath();
            ctx.moveTo(virus.x, virus.y);
            ctx.lineTo(otherVirus.x, otherVirus.y);
            ctx.stroke();
            ctx.setLineDash([]); // Reset dash
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
