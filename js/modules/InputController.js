import { DIRECTIONS } from "./GameConfig.js";

export class InputController {
  constructor(snake, soundManager, gameState) {
    this.snake = snake;
    this.soundManager = soundManager;
    this.gameState = gameState;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.setupEventListeners();
  }

  // Configurar todos os event listeners
  setupEventListeners() {
    this.setupKeyboardControls();
    this.setupTouchControls();
    this.setupButtonControls();
  }

  // Controles do teclado
  setupKeyboardControls() {
    document.addEventListener("keydown", (e) => {
      // Prevenir movimento inverso
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (!this.gameState.isGameOver && !this.gameState.isIntroRunning) {
            this.snake.setDirection(DIRECTIONS.UP);
            this.soundManager.play("move");
          }
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (!this.gameState.isGameOver && !this.gameState.isIntroRunning) {
            this.snake.setDirection(DIRECTIONS.DOWN);
            this.soundManager.play("move");
          }
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (!this.gameState.isGameOver && !this.gameState.isIntroRunning) {
            this.snake.setDirection(DIRECTIONS.LEFT);
            this.soundManager.play("move");
          }
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (!this.gameState.isGameOver && !this.gameState.isIntroRunning) {
            this.snake.setDirection(DIRECTIONS.RIGHT);
            this.soundManager.play("move");
          }
          break;
        case "Enter":
          if (!this.gameState.isIntroRunning && !this.gameState.isGameOver) {
            this.gameState.togglePause();
          }
          break;
      }
    });
  }

  // Controles de toque
  setupTouchControls() {
    // Capturar início do toque
    document.addEventListener(
      "touchstart",
      (e) => {
        const touch = e.touches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
      },
      false
    );

    // Capturar fim do toque e calcular direção
    document.addEventListener(
      "touchend",
      (e) => {
        if (this.gameState.isGameOver || this.gameState.isIntroRunning) return;

        const touch = e.changedTouches[0];
        const dx = touch.clientX - this.touchStartX;
        const dy = touch.clientY - this.touchStartY;

        if (Math.abs(dx) > Math.abs(dy)) {
          // Movimento horizontal
          if (dx > 30) {
            this.snake.setDirection(DIRECTIONS.RIGHT);
            this.soundManager.play("move");
          } else if (dx < -30) {
            this.snake.setDirection(DIRECTIONS.LEFT);
            this.soundManager.play("move");
          }
        } else {
          // Movimento vertical
          if (dy > 30) {
            this.snake.setDirection(DIRECTIONS.DOWN);
            this.soundManager.play("move");
          } else if (dy < -30) {
            this.snake.setDirection(DIRECTIONS.UP);
            this.soundManager.play("move");
          }
        }
      },
      false
    );
  }

  // Controles de botões
  setupButtonControls() {
    // Botão de início
    const startButton = document.getElementById("start-button");
    if (startButton) {
      startButton.addEventListener("click", () => {
        if (this.gameState.isGameOver || this.gameState.isIntroRunning) {
          this.gameState.startCountdownAndGame();
        }
      });
    }

    // Botão de play (intro)
    const playButton = document.getElementById("play-button");
    if (playButton) {
      playButton.addEventListener("click", () => {
        playButton.style.display = "none";
        this.gameState.startCountdownAndGame();
      });
    }

    // Botões do menu de pausa
    const resumeButton = document.getElementById("resume-button");
    const restartButton = document.getElementById("restart-button");

    if (resumeButton) {
      resumeButton.addEventListener("click", () => {
        this.gameState.togglePause();
      });
    }

    if (restartButton) {
      restartButton.addEventListener("click", () => {
        const pauseMenu = document.getElementById("pause-menu");
        if (pauseMenu) pauseMenu.style.display = "none";
        this.gameState.isGameOver = true;
        this.gameState.startCountdownAndGame();
      });
    }
  }
}
