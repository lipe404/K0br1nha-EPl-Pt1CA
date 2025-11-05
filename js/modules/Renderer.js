import { backgroundColors } from "./GameConfig.js";
import { hexToRgb } from "./Utils.js";

export class Renderer {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.messageDisplay = document.getElementById("message-display");

    // Configurar canvas para evitar blur
    this.setupCanvas();

    // Sistema de transição de cores
    this.targetBackgroundColor = backgroundColors[0];
    this.currentBackgroundColor = hexToRgb(backgroundColors[0]);
    this.colorTransitionProgress = 1;
    this.colorTransitionSpeed = 0.05;
    this.currentColorIndex = 0;

    // Listener para fullscreen change
    this.setupFullscreenListener();
  }

  // Configurar canvas para renderização nítida
  setupCanvas() {
    // Configurar imageSmoothing para qualidade alta
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = "high";

    // Garantir que o canvas não tenha transformações CSS que causem blur
    this.canvas.style.imageRendering = "auto";
    this.canvas.style.transform = "none";
  }

  // Listener para mudanças de fullscreen
  setupFullscreenListener() {
    const handleFullscreenChange = () => {
      // Pequeno delay para garantir que a transição terminou
      setTimeout(() => {
        this.setupCanvas();
      }, 100);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
  }

  // Limpar canvas
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // Iniciar transição de cor
  startColorTransition() {
    this.currentColorIndex =
      (this.currentColorIndex + 1) % backgroundColors.length;
    this.targetBackgroundColor = backgroundColors[this.currentColorIndex];
    this.colorTransitionProgress = 0;
  }

  // Atualizar transição de cores
  updateColors() {
    if (this.colorTransitionProgress < 1) {
      this.colorTransitionProgress += this.colorTransitionSpeed;

      // Converter cores alvo para RGB
      const targetRgb = hexToRgb(this.targetBackgroundColor);

      // Interpolar entre cores atual e alvo
      const r = Math.floor(
        this.currentBackgroundColor.r +
          (targetRgb.r - this.currentBackgroundColor.r) *
            this.colorTransitionProgress
      );
      const g = Math.floor(
        this.currentBackgroundColor.g +
          (targetRgb.g - this.currentBackgroundColor.g) *
            this.colorTransitionProgress
      );
      const b = Math.floor(
        this.currentBackgroundColor.b +
          (targetRgb.b - this.currentBackgroundColor.b) *
            this.colorTransitionProgress
      );

      // Atualizar cor atual e aplicar ao background
      this.currentBackgroundColor = { r, g, b };
      document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    }
  }

  // Resetar cores
  resetColors() {
    this.targetBackgroundColor = backgroundColors[0];
    this.currentBackgroundColor = hexToRgb(backgroundColors[0]);
    this.colorTransitionProgress = 1;
    this.currentColorIndex = 0;
    document.body.style.backgroundColor = backgroundColors[0];
  }

  // Mostrar mensagem
  showMessage(message, duration = 1500) {
    this.messageDisplay.textContent = message;
    this.messageDisplay.style.display = "block";

    if (duration > 0) {
      setTimeout(() => {
        this.messageDisplay.style.display = "none";
      }, duration);
    }
  }

  // Ocultar mensagem
  hideMessage() {
    this.messageDisplay.style.display = "none";
  }

  // Desenhar contagem regressiva
  drawCountdown(countdown) {
    this.clear();
    this.ctx.fillStyle = "#fff";
    this.ctx.font = "bold 72px sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.fillText(countdown, this.canvas.width / 2, this.canvas.height / 2);
  }
}
