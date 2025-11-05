import { GAME_CONFIG, DIRECTIONS, snakeColors } from "./GameConfig.js";
import { darkenColor, roundRect } from "./Utils.js";

export class Snake {
  constructor() {
    this.segments = [];
    this.direction = DIRECTIONS.RIGHT;
    this.nextDirection = DIRECTIONS.RIGHT;
    this.currentColorIndex = 0;
    this.reset();
  }

  // Resetar cobra (3 segmentos)
  reset() {
    this.segments = [
      { x: 160, y: 200 },
      { x: 140, y: 200 },
      { x: 120, y: 200 },
    ];
    this.direction = DIRECTIONS.RIGHT;
    this.nextDirection = DIRECTIONS.RIGHT;
    this.currentColorIndex = 0;
  }

  // Atualizar posição da cobra
  update() {
    // Atualizar direção
    this.direction = this.nextDirection;

    // Calcular nova posição da cabeça
    const head = { x: this.segments[0].x, y: this.segments[0].y };

    switch (this.direction) {
      case DIRECTIONS.UP:
        head.y -= GAME_CONFIG.GRID_SIZE;
        break;
      case DIRECTIONS.DOWN:
        head.y += GAME_CONFIG.GRID_SIZE;
        break;
      case DIRECTIONS.LEFT:
        head.x -= GAME_CONFIG.GRID_SIZE;
        break;
      case DIRECTIONS.RIGHT:
        head.x += GAME_CONFIG.GRID_SIZE;
        break;
    }

    // Adicionar nova cabeça
    this.segments.unshift(head);
  }

  // Crescer (não remover cauda)
  grow() {
    // Não remove a cauda, permitindo que a cobra cresça
  }

  // Remover cauda (movimento normal)
  removeTail() {
    this.segments.pop();
  }

  // Verificar colisão com parede
  checkWallCollision() {
    const head = this.segments[0];
    return (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= GAME_CONFIG.CANVAS_WIDTH ||
      head.y >= GAME_CONFIG.CANVAS_HEIGHT
    );
  }

  // Verificar colisão com próprio corpo
  checkSelfCollision() {
    const head = this.segments[0];
    // Colisão com próprio corpo (ignorando a cabeça)
    for (let i = 1; i < this.segments.length; i++) {
      if (head.x === this.segments[i].x && head.y === this.segments[i].y) {
        return true;
      }
    }
    return false;
  }

  // Verificar colisão com obstáculos
  checkObstacleCollision(obstacles) {
    const head = this.segments[0];
    for (const ob of obstacles) {
      if (head.x === ob.x && head.y === ob.y) {
        return true;
      }
    }
    return false;
  }

  // Definir próxima direção (com validação)
  setDirection(newDirection) {
    // Prevenir movimento inverso
    const opposites = {
      [DIRECTIONS.UP]: DIRECTIONS.DOWN,
      [DIRECTIONS.DOWN]: DIRECTIONS.UP,
      [DIRECTIONS.LEFT]: DIRECTIONS.RIGHT,
      [DIRECTIONS.RIGHT]: DIRECTIONS.LEFT,
    };

    if (this.direction !== opposites[newDirection]) {
      this.nextDirection = newDirection;
    }
  }

  // Desenhar a cobra (versão multicolorida)
  draw(ctx) {
    this.segments.forEach((segment, index) => {
      // Cada segmento tem uma cor baseada em sua posição
      const segmentColorIndex =
        (this.currentColorIndex + index) % snakeColors.length;
      const color =
        index === 0
          ? darkenColor(snakeColors[segmentColorIndex], 20)
          : snakeColors[segmentColorIndex];

      // Desenhar segmento
      ctx.fillStyle = color;
      ctx.strokeStyle = "#2E7D32";
      ctx.lineWidth = 2;

      // Segmento com bordas arredondadas
      ctx.beginPath();
      roundRect(
        ctx,
        segment.x,
        segment.y,
        GAME_CONFIG.GRID_SIZE,
        GAME_CONFIG.GRID_SIZE,
        5
      );
      ctx.fill();
      ctx.stroke();

      // Desenhar olhos na cabeça
      if (index === 0) {
        this.drawEyes(ctx, segment);
      }
    });
  }

  // Desenhar os olhos da cobra
  drawEyes(ctx, head) {
    ctx.fillStyle = "#000";
    let leftEye = { x: head.x + 4, y: head.y + 5 };
    let rightEye = { x: head.x + 12, y: head.y + 5 };

    // Ajustar posição dos olhos baseado na direção
    if (this.direction === DIRECTIONS.UP) {
      leftEye = { x: head.x + 5, y: head.y + 4 };
      rightEye = { x: head.x + 15, y: head.y + 4 };
    } else if (this.direction === DIRECTIONS.DOWN) {
      leftEye = { x: head.x + 5, y: head.y + 16 };
      rightEye = { x: head.x + 15, y: head.y + 16 };
    } else if (this.direction === DIRECTIONS.LEFT) {
      leftEye = { x: head.x + 4, y: head.y + 5 };
      rightEye = { x: head.x + 4, y: head.y + 15 };
    }

    // Desenhar olhos
    ctx.beginPath();
    ctx.arc(leftEye.x, leftEye.y, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(rightEye.x, rightEye.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Atualizar índice de cor
  updateColorIndex() {
    this.currentColorIndex = (this.currentColorIndex + 1) % snakeColors.length;
  }

  // Obter posição da cabeça
  getHead() {
    return this.segments[0];
  }

  // Obter tamanho da cobra
  getLength() {
    return this.segments.length;
  }
}
