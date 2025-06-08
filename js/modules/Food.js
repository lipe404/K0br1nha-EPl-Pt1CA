/**
 * Gerencia a geração e renderização da comida
 * Garante que a comida não apareça sobre a cobra ou obstáculos
 */

import { GAME_CONFIG } from './GameConfig.js';

export class Food {
    constructor() {
        this.position = {x: 0, y: 0};
    }

    // Gerar comida em posição aleatória
    generate(snake, obstacles = []) {
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
        
        this.position = {x: newX, y: newY};
    }

    // Verificar se a cobra comeu a comida
    checkCollision(snake) {
        const head = snake.getHead();
        return head.x === this.position.x && head.y === this.position.y;
    }

    // Desenhar comida
    draw(ctx) {
        ctx.fillStyle = '#FF5252';
        ctx.strokeStyle = '#D32F2F';
        ctx.lineWidth = 2;
        
        // Comida redonda
        ctx.beginPath();
        ctx.arc(
            this.position.x + GAME_CONFIG.GRID_SIZE / 2, 
            this.position.y + GAME_CONFIG.GRID_SIZE / 2, 
            8, 0, Math.PI * 2
        );
        ctx.fill();
        ctx.stroke();
    }
}