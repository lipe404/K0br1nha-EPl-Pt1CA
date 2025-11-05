/**
 * Gerencia o sistema de power-ups e penalidades
 * Controla efeitos temporários como turbo, veneno, etc.
 */

import { FOOD_TYPES, GAME_CONFIG } from './GameConfig.js';

export class PowerUpSystem {
    constructor() {
        this.activeEffects = {};
        this.turboTimer = null;
        this.baseSpeed = GAME_CONFIG.INITIAL_SPEED;
    }

    // Aplicar efeito de power-up
    applyEffect(foodType, gameState, snake, score) {
        switch (foodType) {
            case FOOD_TYPES.NORMAL:
                // Comida normal - apenas pontos
                score.add(GAME_CONFIG.POINTS_PER_FOOD);
                break;

            case FOOD_TYPES.GOLDEN:
                // Comida dourada - +50 pontos
                score.add(GAME_CONFIG.GOLDEN_FOOD_POINTS);
                break;

            case FOOD_TYPES.POISON:
                // Comida venenosa - perde 1 segmento
                if (snake.getLength() > 3) {
                    snake.segments.pop(); // Remove último segmento
                }
                break;

            case FOOD_TYPES.TURBO:
                // Comida turbo - velocidade dobra temporariamente
                this.activateTurbo(gameState);
                break;

            case FOOD_TYPES.JOKER:
                // Comida coringa - efeito aleatório
                this.applyJokerEffect(gameState, snake, score);
                break;
        }
    }

    // Ativar efeito turbo
    activateTurbo(gameState) {
        // Limpar timer anterior se existir
        if (this.turboTimer) {
            clearTimeout(this.turboTimer);
        }

        // Salvar velocidade base
        this.baseSpeed = gameState.gameSpeed;

        // Aplicar velocidade turbo (metade do tempo = velocidade dobro)
        const turboSpeed = Math.max(
            GAME_CONFIG.MIN_SPEED,
            Math.floor(this.baseSpeed / GAME_CONFIG.TURBO_SPEED_MULTIPLIER)
        );

        // Atualizar velocidade do jogo
        clearInterval(gameState.gameLoop);
        gameState.gameSpeed = turboSpeed;
        gameState.gameLoop = setInterval(() => gameState.gameStep(), turboSpeed);

        // Marcar como ativo
        this.activeEffects.turbo = true;

        // Desativar após duração
        this.turboTimer = setTimeout(() => {
            this.deactivateTurbo(gameState);
        }, GAME_CONFIG.TURBO_DURATION);
    }

    // Desativar efeito turbo
    deactivateTurbo(gameState) {
        if (this.activeEffects.turbo) {
            // Restaurar velocidade base
            clearInterval(gameState.gameLoop);
            gameState.gameSpeed = this.baseSpeed;
            gameState.gameLoop = setInterval(() => gameState.gameStep(), this.baseSpeed);
            
            this.activeEffects.turbo = false;
            this.turboTimer = null;
        }
    }

    // Aplicar efeito coringa (aleatório)
    applyJokerEffect(gameState, snake, score) {
        const random = Math.random();
        
        if (random < 0.4) {
            // 40% - Power-up: pontos extras
            const bonusPoints = Math.floor(Math.random() * 50) + 10;
            score.add(bonusPoints);
        } else if (random < 0.6) {
            // 20% - Power-up: turbo
            this.activateTurbo(gameState);
        } else if (random < 0.8) {
            // 20% - Penalidade: perder segmentos
            const segmentsToLose = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < segmentsToLose && snake.getLength() > 3; i++) {
                snake.segments.pop();
            }
        } else {
            // 20% - Penalidade: perder pontos
            const pointsToLose = Math.floor(Math.random() * 30) + 5;
            score.add(-pointsToLose);
        }
    }

    // Atualizar velocidade base (quando velocidade normal aumenta)
    updateBaseSpeed(newSpeed) {
        // Se não há turbo ativo, atualizar base
        if (!this.activeEffects.turbo) {
            this.baseSpeed = newSpeed;
        }
    }

    // Verificar se turbo está ativo
    isTurboActive() {
        return this.activeEffects.turbo === true;
    }

    // Limpar todos os efeitos
    clear() {
        if (this.turboTimer) {
            clearTimeout(this.turboTimer);
            this.turboTimer = null;
        }
        this.activeEffects = {};
        this.baseSpeed = GAME_CONFIG.INITIAL_SPEED;
    }
}

