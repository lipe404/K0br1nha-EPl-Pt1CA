/**
 * Arquivo principal que integra todos os módulos
 * Inicializa o jogo e conecta todos os componentes
 */

import { Snake } from "./modules/Snake.js";
import { Food } from "./modules/Food.js";
import { Score } from "./modules/Score.js";
import { Obstacles } from "./modules/Obstacles.js";
import { SoundManager } from "./modules/SoundManager.js";
import { Renderer } from "./modules/Renderer.js";
import { InputController } from "./modules/InputController.js";
import { GameState } from "./modules/GameState.js";
import { IntroAnimation } from "./modules/IntroAnimation.js";

// Inicialização do jogo
document.addEventListener("DOMContentLoaded", () => {
  // Elementos do DOM
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");

  // Instanciar módulos
  const snake = new Snake();
  const food = new Food();
  const score = new Score();
  const obstacles = new Obstacles();
  const soundManager = new SoundManager();
  const renderer = new Renderer(canvas, ctx);
  const introAnimation = new IntroAnimation(canvas, ctx);

  // Instanciar estado do jogo
  const gameState = new GameState(
    snake,
    food,
    score,
    obstacles,
    soundManager,
    renderer,
    introAnimation
  );

  // Instanciar controle de entrada
  const inputController = new InputController(snake, soundManager, gameState);

  // Mensagem inicial
  renderer.showMessage(
    "Arraste o dedo no touch para mover a cobra, ou use as setas do teclado",
    0
  );

  // Iniciar animação de introdução
  gameState.startIntroAnimation();
});
