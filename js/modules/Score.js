/**
 * Gerencia o sistema de pontuação e níveis de dificuldade
 * Controla aumento de velocidade e geração de obstáculos
 */

import { GAME_CONFIG } from './GameConfig.js';

export class Score {
    constructor() {
        this.current = 0;
        this.speedLevel = 0;
        this.scoreDisplay = null;
        this.createScoreDisplay();
    }

    // Criar elemento de pontuação
    createScoreDisplay() {
        // Verificar se já existe
        this.scoreDisplay = document.getElementById('score-display');
        if (!this.scoreDisplay) {
            this.scoreDisplay = document.createElement('div');
            this.scoreDisplay.id = 'score-display';
            const startButton = document.getElementById('start-button');
            if (startButton) {
                document.body.insertBefore(this.scoreDisplay, startButton);
            } else {
                document.body.appendChild(this.scoreDisplay);
            }
        }
        this.updateDisplay();
    }

    // Resetar pontuação
    reset() {
        this.current = 0;
        this.speedLevel = 0;
        this.updateDisplay();
    }

    // Adicionar pontos
    add(points = GAME_CONFIG.POINTS_PER_FOOD) {
        this.current += points;
        this.updateDisplay();
    }

    // Atualizar display
    updateDisplay() {
        if (this.scoreDisplay) {
            this.scoreDisplay.textContent = `Pontuação: ${this.current}`;
        }
    }

    // Verificar se deve aumentar velocidade
    shouldIncreaseSpeed() {
        const newLevel = Math.floor(this.current / GAME_CONFIG.SPEED_LEVEL_THRESHOLD);
        if (newLevel > this.speedLevel) {
            this.speedLevel = newLevel;
            return true;
        }
        return false;
    }

    // Verificar se deve adicionar obstáculos
    shouldAddObstacles() {
        return this.current > 0 && this.current % GAME_CONFIG.OBSTACLE_LEVEL_THRESHOLD === 0;
    }

    // Obter nível atual de obstáculos
    getObstacleLevel() {
        return Math.floor(this.current / GAME_CONFIG.OBSTACLE_LEVEL_THRESHOLD);
    }

    // Obter pontuação atual
    getCurrent() {
        return this.current;
    }
}