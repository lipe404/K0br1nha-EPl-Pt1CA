/**
 * Gerencia o estado geral do jogo e o loop principal
 * Controla início, pausa, fim de jogo e integração entre módulos
 */

import { GAME_CONFIG, funnyMessages } from './GameConfig.js';
import { entrarEmTelaCheia } from './Utils.js';

export class GameState {
    constructor(snake, food, score, obstacles, soundManager, renderer, introAnimation) {
        this.snake = snake;
        this.food = food;
        this.score = score;
        this.obstacles = obstacles;
        this.soundManager = soundManager;
        this.renderer = renderer;
        this.introAnimation = introAnimation;
        
        // Estado do jogo
        this.gameSpeed = GAME_CONFIG.INITIAL_SPEED;
        this.gameLoop = null;
        this.isGameOver = false;
        this.isGamePaused = false;
        this.isIntroRunning = true;
        
        this.setupUI();
    }

    // Configurar elementos da UI
    setupUI() {
        // Menu de pausa
        const pauseMenu = document.createElement('div');
        pauseMenu.id = 'pause-menu';
        pauseMenu.style.display = 'none';
        pauseMenu.innerHTML = `
          <div class="menu-box">
            <h2>Jogo Pausado</h2>
            <button id="resume-button">Retomar</button>
            <button id="restart-button">Reiniciar</button>
          </div>
        `;
        
        // Botão de início
        const playButton = document.createElement('button');
        playButton.id = 'play-button';
        playButton.textContent = 'Jogar';
        playButton.classList.add('btn-inicio-psicodelico');
        playButton.style.display = 'none'; // Só aparece na intro
        
        document.body.appendChild(playButton);
        document.body.appendChild(pauseMenu);
    }

    // Inicializar o jogo
    initGame() {
        entrarEmTelaCheia(); // Ativar tela cheia
        
        // Resetar todos os componentes
        this.snake.reset();
        this.score.reset();
        this.obstacles.clear();
        this.renderer.resetColors();
        
        // Resetar estado
        this.gameSpeed = GAME_CONFIG.INITIAL_SPEED;
        this.isGameOver = false;
        this.isGamePaused = false;
        
        // Atualizar UI
        this.renderer.hideMessage();
        const pauseMenu = document.getElementById('pause-menu');
        if (pauseMenu) pauseMenu.style.display = 'none';
        
        // Gerar primeira comida
        this.food.generate(this.snake, this.obstacles.getList());
        
        // Limpar qualquer jogo anterior e iniciar novo
        if (this.gameLoop) clearInterval(this.gameLoop);
        this.gameLoop = setInterval(() => this.gameStep(), this.gameSpeed);
        this.soundManager.startMusic();
    }

    // Contagem regressiva
    startCountdownAndGame() {
        this.introAnimation.stop();
        let countdown = 3;
        
        const countdownInterval = setInterval(() => {
            this.renderer.drawCountdown(countdown);
            countdown--;
            
            if (countdown < 0) {
                clearInterval(countdownInterval);
                this.isIntroRunning = false;
                this.initGame(); // Inicia o jogo real
            }
        }, 1000);
    }

    // Ajustar velocidade do jogo
    adjustGameSpeed() {
        // Verificar se deve aumentar velocidade
        if (this.score.shouldIncreaseSpeed()) {
            this.gameSpeed = Math.max(GAME_CONFIG.MIN_SPEED, this.gameSpeed - 10);
            clearInterval(this.gameLoop);
            this.gameLoop = setInterval(() => this.gameStep(), this.gameSpeed);
        }
        
        // Verificar se deve adicionar obstáculos
        if (this.score.shouldAddObstacles()) {
            const level = this.score.getObstacleLevel();
            this.obstacles.generate(level, this.snake, this.food);
        }
    }

    // Lógica quando a cobra come a comida
    handleFoodEaten() {
        // Tocar som de comida
        this.soundManager.play('food');
        
        // Aumentar pontuação
        this.score.add();
        
        // Iniciar transição de cor
        this.snake.updateColorIndex();
        this.renderer.startColorTransition();
        
        // Aumentar velocidade (com limite mínimo)
        this.gameSpeed = Math.max(GAME_CONFIG.MIN_SPEED, this.gameSpeed - GAME_CONFIG.SPEED_DECREASE);
        clearInterval(this.gameLoop);
        this.gameLoop = setInterval(() => this.gameStep(), this.gameSpeed);
        
        // Mostrar mensagem e gerar nova comida
        this.adjustGameSpeed(); // Aqui ocorre o aumento de dificuldade progressivo
        this.showRandomMessage();
        this.food.generate(this.snake, this.obstacles.getList());
    }

    // Verificar colisões
    checkCollisions() {
        // Colisão com parede
        if (this.snake.checkWallCollision()) {
            this.gameOver("TCHOOOLAAA!");
            return true;
        }
        
        // Colisão com próprio corpo
        if (this.snake.checkSelfCollision()) {
            this.gameOver("É UM OROBOROS NÉ!");
            return true;
        }
        
        // Colisão com obstáculos
        if (this.snake.checkObstacleCollision(this.obstacles.getList())) {
            this.gameOver("VOCÊ BATEU EM UM BLOCO!");
            return true;
        }
        
        return false;
    }

    // Mostrar mensagem aleatória
    showRandomMessage() {
        const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
        this.renderer.showMessage(randomMessage);
    }

    // Fim de jogo
    gameOver(message) {
        this.isGameOver = true;
        clearInterval(this.gameLoop);
        this.soundManager.play('gameOver');
        this.soundManager.stopMusic();
        this.renderer.showMessage(`${message} Pontuação final: ${this.score.getCurrent()}`, 0);
    }

    // Alternar pausa
    togglePause() {
        this.isGamePaused = !this.isGamePaused;
        const pauseMenu = document.getElementById('pause-menu');
        
        if (this.isGamePaused) {
            clearInterval(this.gameLoop);
            if (pauseMenu) pauseMenu.style.display = 'block';
        } else {
            if (pauseMenu) pauseMenu.style.display = 'none';
            this.gameLoop = setInterval(() => this.gameStep(), this.gameSpeed);
        }
    }

    // Loop principal do jogo
    gameStep() {
        if (this.isGameOver) return;
        
        // Limpar canvas
        this.renderer.clear();
        
        // Atualizar elementos
        this.snake.update();
        this.renderer.updateColors();
        
        // Verificar se comeu comida
        if (this.food.checkCollision(this.snake)) {
            this.snake.grow();
            this.handleFoodEaten();
        } else {
            // Remover cauda se não comeu
            this.snake.removeTail();
        }
        
        // Verificar colisões
        if (this.checkCollisions()) return;
        
        // Desenhar elementos
        this.food.draw(this.renderer.ctx);
        this.snake.draw(this.renderer.ctx);
        this.obstacles.draw(this.renderer.ctx);
    }

    // Iniciar animação de introdução
    startIntroAnimation() {
        this.introAnimation.start();
    }
}