import { GAME_CONFIG } from "./GameConfig.js";
import { roundRect } from "./Utils.js";

export class Obstacles {
  constructor() {
    this.list = [];
  }

  // Gerar obstáculos
  generate(level, snake, food) {
    const gridSize = GAME_CONFIG.CANVAS_WIDTH / GAME_CONFIG.GRID_SIZE;
    const numObstacles = level * 3; // Número de obstáculos cresce com o nível
    this.list = []; // Resetar obstáculos

    for (let i = 0; i < numObstacles; i++) {
      let valid = false;
      let newX, newY;

      while (!valid) {
        newX = Math.floor(Math.random() * gridSize) * GAME_CONFIG.GRID_SIZE;
        newY = Math.floor(Math.random() * gridSize) * GAME_CONFIG.GRID_SIZE;
        valid = true;

        // Impedir sobreposição com a cobra
        for (const segment of snake.segments) {
          if (segment.x === newX && segment.y === newY) {
            valid = false;
            break;
          }
        }

        // Impedir sobreposição com a comida
        if (food.position.x === newX && food.position.y === newY) {
          valid = false;
        }
      }

      this.list.push({ x: newX, y: newY });
    }
  }

  // Desenhar obstáculos
  draw(ctx) {
    ctx.fillStyle = "#555";
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 2;

    this.list.forEach((ob) => {
      ctx.beginPath();
      roundRect(
        ctx,
        ob.x,
        ob.y,
        GAME_CONFIG.GRID_SIZE,
        GAME_CONFIG.GRID_SIZE,
        5
      );
      ctx.fill();
      ctx.stroke();
    });
  }

  // Obter lista de obstáculos
  getList() {
    return this.list;
  }

  // Limpar obstáculos
  clear() {
    this.list = [];
  }
}
