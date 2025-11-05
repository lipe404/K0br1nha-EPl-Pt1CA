import { GAME_CONFIG, funnyMessages } from "./GameConfig.js";
import { entrarEmTelaCheia } from "./Utils.js";
import { PowerUpSystem } from "./PowerUpSystem.js";
import { FOOD_TYPES } from "./GameConfig.js";

export class GameState {
  constructor(
    snake,
    food,
    score,
    obstacles,
    soundManager,
    renderer,
    introAnimation
  ) {
    this.snake = snake;
    this.food = food;
    this.score = score;
    this.obstacles = obstacles;
    this.soundManager = soundManager;
    this.renderer = renderer;
    this.introAnimation = introAnimation;

    // Sistema de power-ups
    this.powerUpSystem = new PowerUpSystem();

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
    // Menu de pausa - verificar se já existe
    let pauseMenu = document.getElementById("pause-menu");
    if (!pauseMenu) {
      pauseMenu = document.createElement("div");
      pauseMenu.id = "pause-menu";
      pauseMenu.style.display = "none";
      pauseMenu.innerHTML = `
              <div class="menu-box">
                <h2>Jogo Pausado</h2>
                <button id="resume-button">Retomar</button>
                <button id="restart-button">Reiniciar</button>
              </div>
            `;
      document.body.appendChild(pauseMenu);
    }

    // Botão de início - verificar se já existe
    let playButton = document.getElementById("play-button");
    if (!playButton) {
      playButton = document.createElement("button");
      playButton.id = "play-button";
      playButton.textContent = "Jogar";
      playButton.classList.add("btn-inicio-psicodelico");
      playButton.style.display = "none"; // Só aparece na intro
      document.body.appendChild(playButton);
    }
  }

  // Inicializar o jogo
  initGame() {
    entrarEmTelaCheia(); // Ativar tela cheia

    // Resetar todos os componentes
    this.snake.reset();
    this.score.reset();
    this.obstacles.clear();
    this.renderer.resetColors();
    this.powerUpSystem.clear();

    // Resetar estado
    this.gameSpeed = GAME_CONFIG.INITIAL_SPEED;
    this.isGameOver = false;
    this.isGamePaused = false;
    this.powerUpSystem.baseSpeed = GAME_CONFIG.INITIAL_SPEED;

    // Atualizar UI
    this.renderer.hideMessage();
    const pauseMenu = document.getElementById("pause-menu");
    if (pauseMenu) pauseMenu.style.display = "none";

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
      const newSpeed = Math.max(GAME_CONFIG.MIN_SPEED, this.gameSpeed - 10);

      // Atualizar velocidade base no power-up system
      this.powerUpSystem.updateBaseSpeed(newSpeed);

      // Se turbo não está ativo, atualizar velocidade do jogo
      if (!this.powerUpSystem.isTurboActive()) {
        this.gameSpeed = newSpeed;
        clearInterval(this.gameLoop);
        this.gameLoop = setInterval(() => this.gameStep(), this.gameSpeed);
      } else {
        // Turbo ativo, apenas atualizar base speed
        this.gameSpeed = newSpeed;
      }
    }

    // Verificar se deve adicionar obstáculos
    if (this.score.shouldAddObstacles()) {
      const level = this.score.getObstacleLevel();
      this.obstacles.generate(level, this.snake, this.food);
    }
  }

  // Lógica quando a cobra come a comida
  handleFoodEaten() {
    const foodType = this.food.getType();

    // Tocar som de comida
    this.soundManager.play("food");

    // Aplicar efeito do power-up (inclui pontos para comida normal)
    this.powerUpSystem.applyEffect(foodType, this, this.snake, this.score);

    // Iniciar transição de cor (apenas para comidas normais e douradas)
    if (foodType === FOOD_TYPES.NORMAL || foodType === FOOD_TYPES.GOLDEN) {
      this.snake.updateColorIndex();
      this.renderer.startColorTransition();
    }

    // Aumentar velocidade (com limite mínimo) - apenas para comidas normais
    if (foodType === FOOD_TYPES.NORMAL) {
      const newSpeed = Math.max(
        GAME_CONFIG.MIN_SPEED,
        this.gameSpeed - GAME_CONFIG.SPEED_DECREASE
      );
      this.powerUpSystem.updateBaseSpeed(newSpeed);

      if (!this.powerUpSystem.isTurboActive()) {
        this.gameSpeed = newSpeed;
        clearInterval(this.gameLoop);
        this.gameLoop = setInterval(() => this.gameStep(), this.gameSpeed);
      } else {
        this.gameSpeed = newSpeed;
      }
    }

    // Mostrar mensagem específica baseada no tipo
    this.showFoodMessage(foodType);

    // Ajustar velocidade do jogo (aumento progressivo)
    this.adjustGameSpeed();

    // Gerar nova comida
    this.food.generate(this.snake, this.obstacles.getList());
  }

  // Mostrar mensagem baseada no tipo de comida
  showFoodMessage(foodType) {
    let message = "";
    switch (foodType) {
      case FOOD_TYPES.GOLDEN:
        message = "★ OURO! +50 pontos!";
        break;
      case FOOD_TYPES.POISON:
        message = "☠ VENENO! Perdeu 1 segmento!";
        break;
      case FOOD_TYPES.TURBO:
        message = "⚡ TURBO ATIVADO!";
        break;
      case FOOD_TYPES.JOKER:
        message = "? CORINGA! Efeito aleatório!";
        break;
      default:
        this.showRandomMessage();
        return;
    }
    this.renderer.showMessage(message, 2000);
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
    const randomMessage =
      funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
    this.renderer.showMessage(randomMessage);
  }

  // Fim de jogo
  gameOver(message) {
    this.isGameOver = true;
    clearInterval(this.gameLoop);
    this.powerUpSystem.clear(); // Limpar power-ups ativos
    this.soundManager.play("gameOver");
    this.soundManager.stopMusic();
    this.renderer.showMessage(
      `${message} Pontuação final: ${this.score.getCurrent()}`,
      0
    );
  }

  // Alternar pausa
  togglePause() {
    this.isGamePaused = !this.isGamePaused;
    const pauseMenu = document.getElementById("pause-menu");

    if (this.isGamePaused) {
      clearInterval(this.gameLoop);
      if (pauseMenu) pauseMenu.style.display = "block";
    } else {
      if (pauseMenu) pauseMenu.style.display = "none";
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
    this.food.update(); // Atualizar animação da comida

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
