/**
 * Jogo da Cobrinha EPléPt1CA - Versão Modularizada
 * Desenvolvido por Felipe Toledo @spaceman.404
 *
 * Este arquivo integra todos os módulos do jogo para criar uma experiência completa.
 * Arquitetura modular para facilitar manutenção e expansão.
 */

// Importar todos os módulos
import { Snake } from "./modules/Snake.js";
import { Food } from "./modules/Food.js";
import { Obstacles } from "./modules/Obstacles.js";
import { Score } from "./modules/Score.js";
import { Renderer } from "./modules/Renderer.js";
import { SoundManager } from "./modules/SoundManager.js";
import { GameState } from "./modules/GameState.js";
import { IntroAnimation } from "./modules/IntroAnimation.js";
import { InputController } from "./modules/InputController.js";

/**
 * Inicialização do jogo
 */
class Game {
  constructor() {
    // Obter elementos do DOM
    this.canvas = document.getElementById("game-canvas");
    this.ctx = this.canvas.getContext("2d");

    // Verificar se canvas existe
    if (!this.canvas || !this.ctx) {
      console.error("Canvas não encontrado!");
      return;
    }

    // Inicializar componentes do jogo
    this.initializeComponents();

    // Inicializar controle de entrada
    this.inputController = new InputController(
      this.snake,
      this.soundManager,
      this.gameState
    );

    // Mensagem inicial
    this.showInitialMessage();

    // Iniciar animação de introdução
    this.startIntro();
  }

  /**
   * Inicializar todos os componentes do jogo
   */
  initializeComponents() {
    // Criar instâncias dos módulos
    this.snake = new Snake();
    this.food = new Food();
    this.obstacles = new Obstacles();
    this.score = new Score();
    this.renderer = new Renderer(this.canvas, this.ctx);
    this.soundManager = new SoundManager();
    this.introAnimation = new IntroAnimation(this.canvas, this.ctx);

    // Criar estado do jogo (precisa de todos os componentes)
    this.gameState = new GameState(
      this.snake,
      this.food,
      this.score,
      this.obstacles,
      this.soundManager,
      this.renderer,
      this.introAnimation
    );
  }

  /**
   * Mostrar mensagem inicial
   */
  showInitialMessage() {
    const messageDisplay = document.getElementById("message-display");
    if (messageDisplay) {
      messageDisplay.textContent =
        "Arraste o dedo no touch para mover a cobra, ou use as setas do teclado";
      messageDisplay.style.display = "block";
    }
  }

  /**
   * Iniciar animação de introdução
   */
  startIntro() {
    // Aguardar carregamento completo da página
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        this.gameState.startIntroAnimation();
      });
    } else {
      this.gameState.startIntroAnimation();
    }
  }
}

// Inicializar o jogo quando a página carregar
window.addEventListener("load", () => {
  try {
    const game = new Game();
    console.log("🎮 Jogo inicializado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao inicializar o jogo:", error);
  }
});
