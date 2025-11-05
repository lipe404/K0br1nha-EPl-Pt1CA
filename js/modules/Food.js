import { GAME_CONFIG, FOOD_TYPES } from "./GameConfig.js";

export class Food {
  constructor() {
    this.position = { x: 0, y: 0 };
    this.type = FOOD_TYPES.NORMAL;
    this.pulseAnimation = 0;
  }

  // Gerar comida em posição aleatória
  generate(snake, obstacles = [], forceType = null) {
    const gridSize = GAME_CONFIG.CANVAS_WIDTH / GAME_CONFIG.GRID_SIZE;
    let validPosition = false;
    let newX, newY;

    // Garantir que a comida não apareça em cima da cobra ou obstáculos
    while (!validPosition) {
      newX = Math.floor(Math.random() * gridSize) * GAME_CONFIG.GRID_SIZE;
      newY = Math.floor(Math.random() * gridSize) * GAME_CONFIG.GRID_SIZE;
      validPosition = true;

      // Verificar colisão com cobra
      for (const segment of snake.segments) {
        if (segment.x === newX && segment.y === newY) {
          validPosition = false;
          break;
        }
      }

      // Verificar colisão com obstáculos
      if (validPosition) {
        for (const obstacle of obstacles) {
          if (obstacle.x === newX && obstacle.y === newY) {
            validPosition = false;
            break;
          }
        }
      }
    }

    this.position = { x: newX, y: newY };

    // Determinar tipo de comida
    if (forceType) {
      this.type = forceType;
    } else {
      this.determineFoodType();
    }

    this.pulseAnimation = 0;
  }

  // Determinar tipo de comida aleatoriamente
  determineFoodType() {
    const random = Math.random();

    // Probabilidades:
    // 60% - Normal
    // 15% - Dourada
    // 10% - Venenosa
    // 10% - Turbo
    // 5% - Coringa

    if (random < 0.6) {
      this.type = FOOD_TYPES.NORMAL;
    } else if (random < 0.75) {
      this.type = FOOD_TYPES.GOLDEN;
    } else if (random < 0.85) {
      this.type = FOOD_TYPES.POISON;
    } else if (random < 0.95) {
      this.type = FOOD_TYPES.TURBO;
    } else {
      this.type = FOOD_TYPES.JOKER;
    }
  }

  // Obter tipo atual
  getType() {
    return this.type;
  }

  // Verificar se a cobra comeu a comida
  checkCollision(snake) {
    const head = snake.getHead();
    return head.x === this.position.x && head.y === this.position.y;
  }

  // Atualizar animação
  update() {
    this.pulseAnimation += 0.1;
  }

  // Desenhar comida
  draw(ctx) {
    const centerX = this.position.x + GAME_CONFIG.GRID_SIZE / 2;
    const centerY = this.position.y + GAME_CONFIG.GRID_SIZE / 2;

    // Efeito de pulso
    const pulseSize = 8 + Math.sin(this.pulseAnimation) * 2;

    // Cores e estilos baseados no tipo
    let fillColor, strokeColor, glowColor;

    switch (this.type) {
      case FOOD_TYPES.GOLDEN:
        fillColor = "#FFD700";
        strokeColor = "#FFA500";
        glowColor = "rgba(255, 215, 0, 0.5)";
        break;
      case FOOD_TYPES.POISON:
        fillColor = "#9C27B0";
        strokeColor = "#6A1B9A";
        glowColor = "rgba(156, 39, 176, 0.5)";
        break;
      case FOOD_TYPES.TURBO:
        fillColor = "#00FFFF";
        strokeColor = "#0097A7";
        glowColor = "rgba(0, 255, 255, 0.5)";
        break;
      case FOOD_TYPES.JOKER:
        // Coringa muda de cor
        const hue = (Date.now() / 50) % 360;
        fillColor = `hsl(${hue}, 70%, 50%)`;
        strokeColor = `hsl(${hue}, 90%, 30%)`;
        glowColor = `hsla(${hue}, 70%, 50%, 0.5)`;
        break;
      default: // NORMAL
        fillColor = "#FF5252";
        strokeColor = "#D32F2F";
        glowColor = "rgba(255, 82, 82, 0.3)";
    }

    // Efeito de brilho
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 10;

    // Desenhar comida
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Resetar shadow
    ctx.shadowBlur = 0;

    // Ícone especial para tipos especiais
    if (this.type !== FOOD_TYPES.NORMAL) {
      ctx.fillStyle = "#FFF";
      ctx.font = "bold 12px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      let icon = "";
      switch (this.type) {
        case FOOD_TYPES.GOLDEN:
          icon = "★";
          break;
        case FOOD_TYPES.POISON:
          icon = "☠";
          break;
        case FOOD_TYPES.TURBO:
          icon = "⚡";
          break;
        case FOOD_TYPES.JOKER:
          icon = "?";
          break;
      }

      ctx.fillText(icon, centerX, centerY);
    }
  }
}
