import { snakeColors } from "./GameConfig.js";
import { roundRect } from "./Utils.js";

export class IntroAnimation {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.introSnakes = [];
    this.introAnimationLoop = null;
    this.mouse = { x: null, y: null };
    this.setupMouseTracking();
  }

  // Configurar rastreamento do mouse
  setupMouseTracking() {
    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });
  }

  // Iniciar animação de introdução
  start() {
    // Criar cobras
    this.introSnakes = Array.from(
      { length: 15 },
      () => new IntroSnake(this.canvas, this.mouse)
    );

    this.introAnimationLoop = setInterval(() => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.introSnakes.forEach((snake) => {
        snake.update();
        snake.draw(this.ctx);
      });
    }, 1000 / 60); // 60 FPS

    const playButton = document.getElementById("play-button");
    if (playButton) playButton.style.display = "block";
  }

  // Parar animação de introdução
  stop() {
    if (this.introAnimationLoop) {
      clearInterval(this.introAnimationLoop);
      this.introAnimationLoop = null;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

// Cobras de introdução
class IntroSnake {
  constructor(canvas, mouse) {
    this.canvas = canvas;
    this.mouse = mouse;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.direction = Math.random() * 2 * Math.PI;
    this.speed = 1 + Math.random() * 2;
    this.length = 10 + Math.floor(Math.random() * 5);
    this.segments = Array.from({ length: this.length }, (_, i) => ({
      x: this.x - i * 10 * Math.cos(this.direction),
      y: this.y - i * 10 * Math.sin(this.direction),
    }));
    this.color = snakeColors[Math.floor(Math.random() * snakeColors.length)];
    this.scared = false;
    this.scareTimer = 0;
  }

  update() {
    const dx = Math.cos(this.direction) * this.speed;
    const dy = Math.sin(this.direction) * this.speed;
    this.x += dx;
    this.y += dy;

    // Rebater nas bordas
    if (this.x < 0 || this.x > this.canvas.width)
      this.direction = Math.PI - this.direction;
    if (this.y < 0 || this.y > this.canvas.height)
      this.direction = -this.direction;

    // Interação com o mouse (efeito de fuga)
    if (this.mouse.x !== null && this.mouse.y !== null) {
      const distX = this.x - this.mouse.x;
      const distY = this.y - this.mouse.y;
      const distance = Math.sqrt(distX * distX + distY * distY);
      const escapeRadius = 80;

      if (distance < escapeRadius) {
        // Direção oposta ao mouse
        this.direction = Math.atan2(distY, distX) + (Math.random() - 0.5) * 0.5;
        this.scared = true;
        this.scareTimer = 10;
      }
    }

    // Contagem decrescente do susto
    if (this.scareTimer > 0) {
      this.scareTimer--;
    } else {
      this.scared = false;
    }

    // Atualizar segmentos
    this.segments.pop();
    this.segments.unshift({ x: this.x, y: this.y });
  }

  draw(ctx) {
    ctx.lineWidth = 1;
    this.segments.forEach((seg, i) => {
      // Efeito de susto: brilho e vibração
      let offsetX = 0,
        offsetY = 0;
      let color = this.color;

      if (this.scared) {
        offsetX = (Math.random() - 0.5) * 4; // vibração leve
        offsetY = (Math.random() - 0.5) * 4;
        color = "white"; // flash branco
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.fillStyle = color;
      ctx.strokeStyle = "#111";
      ctx.beginPath();
      roundRect(ctx, seg.x + offsetX, seg.y + offsetY, 10, 10, 3);
      ctx.fill();
      ctx.stroke();
    });
  }
}
