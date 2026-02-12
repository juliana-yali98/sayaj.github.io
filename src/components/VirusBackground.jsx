import React, { useEffect, useRef } from "react";

const VirusBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const setSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    setSize();

    const viruses = [];
    const virusCount = 25;
    const cells = [];
    const cellCount = 15;

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
        this.size = Math.random() * 8 + 5;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
        this.opacity = Math.random() * 0.4 + 0.3;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.spikeCount = 8;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        this.pulsePhase += 0.03;

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

        // Hexagonal capsid
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

        // Spike proteins
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

          ctx.fillStyle = `rgba(79, 143, 111, ${this.opacity})`;
          ctx.beginPath();
          ctx.arc(endX, endY, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    for (let i = 0; i < cellCount; i++) {
      cells.push(new PlantCell());
    }

    for (let i = 0; i < virusCount; i++) {
      viruses.push(new Virus());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      cells.forEach(cell => cell.draw());

      viruses.forEach((virus, i) => {
        virus.update();
        virus.draw();

        viruses.slice(i + 1).forEach(otherVirus => {
          const dx = virus.x - otherVirus.x;
          const dy = virus.y - otherVirus.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            const gradient = ctx.createLinearGradient(
              virus.x,
              virus.y,
              otherVirus.x,
              otherVirus.y
            );

            gradient.addColorStop(
              0,
              `rgba(199, 58, 47, ${0.15 * (1 - distance / 200)})`
            );
            gradient.addColorStop(
              0.5,
              `rgba(242, 140, 40, ${0.2 * (1 - distance / 200)})`
            );
            gradient.addColorStop(
              1,
              `rgba(58, 123, 213, ${0.15 * (1 - distance / 200)})`
            );

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5;
            ctx.setLineDash([5, 3]);
            ctx.beginPath();
            ctx.moveTo(virus.x, virus.y);
            ctx.lineTo(otherVirus.x, otherVirus.y);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        });
      });

      requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener("resize", setSize);
    return () => window.removeEventListener("resize", setSize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0
      }}
    />
  );
};

export default VirusBackground;

