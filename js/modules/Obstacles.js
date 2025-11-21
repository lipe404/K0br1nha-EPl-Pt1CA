import { GAME_CONFIG } from "./GameConfig.js";
import { roundRect } from "./Utils.js";

export class Obstacles {
  constructor() {
    this.list = [];
  }

  // Gerar obstáculos
  generate(level, snake, food) {
    const gridSize = GAME_CONFIG.CANVAS_WIDTH / GAME_CONFIG.GRID_SIZE;
    const targetCount = level * 3;
    const currentCount = this.list.length;
    const toAdd = Math.max(0, targetCount - currentCount);
    let attempts = 0;
    let added = 0;
    const maxAttempts = toAdd * 50;

    while (added < toAdd && attempts < maxAttempts) {
      attempts++;
      const newX = Math.floor(Math.random() * gridSize) * GAME_CONFIG.GRID_SIZE;
      const newY = Math.floor(Math.random() * gridSize) * GAME_CONFIG.GRID_SIZE;

      if (this.isBlockedCell(newX, newY, snake, food)) continue;
      if (this.list.some((ob) => ob.x === newX && ob.y === newY)) continue;

      const candidateList = [...this.list, { x: newX, y: newY }];
      if (this.isPathAvailable(snake, food, candidateList)) {
        this.list.push({ x: newX, y: newY });
        added++;
      }
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

  isBlockedCell(x, y, snake, food) {
    for (const segment of snake.segments) {
      if (segment.x === x && segment.y === y) return true;
    }
    if (food.position.x === x && food.position.y === y) return true;
    return false;
  }

  isPathAvailable(snake, food, obstacles) {
    const cols = GAME_CONFIG.CANVAS_WIDTH / GAME_CONFIG.GRID_SIZE;
    const rows = GAME_CONFIG.CANVAS_HEIGHT / GAME_CONFIG.GRID_SIZE;
    const startX = Math.floor(snake.segments[0].x / GAME_CONFIG.GRID_SIZE);
    const startY = Math.floor(snake.segments[0].y / GAME_CONFIG.GRID_SIZE);
    const endX = Math.floor(food.position.x / GAME_CONFIG.GRID_SIZE);
    const endY = Math.floor(food.position.y / GAME_CONFIG.GRID_SIZE);

    const blocked = new Set();
    for (const ob of obstacles) {
      const bx = Math.floor(ob.x / GAME_CONFIG.GRID_SIZE);
      const by = Math.floor(ob.y / GAME_CONFIG.GRID_SIZE);
      blocked.add(`${bx}:${by}`);
    }
    for (let i = 1; i < snake.segments.length; i++) {
      const seg = snake.segments[i];
      const sx = Math.floor(seg.x / GAME_CONFIG.GRID_SIZE);
      const sy = Math.floor(seg.y / GAME_CONFIG.GRID_SIZE);
      blocked.add(`${sx}:${sy}`);
    }
    blocked.delete(`${endX}:${endY}`);

    const queue = [[startX, startY]];
    const visited = new Set([`${startX}:${startY}`]);
    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];

    while (queue.length) {
      const [cx, cy] = queue.shift();
      if (cx === endX && cy === endY) return true;
      for (const [dx, dy] of dirs) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
        const key = `${nx}:${ny}`;
        if (visited.has(key)) continue;
        if (blocked.has(key)) continue;
        visited.add(key);
        queue.push([nx, ny]);
      }
    }
    return false;
  }
}
