export class SoundManager {
  constructor() {
    this.sounds = {};
    this.loadSounds();
  }

  // Carregar todos os sons
  loadSounds() {
    try {
      //Sons do jogo
      this.sounds.music = new Audio("midia/music2.mp3");
      this.sounds.music.loop = true;
      this.sounds.music.volume = 0.3; // Volume inicial
      this.sounds.music.addEventListener("error", () => {
        console.warn("Não foi possível carregar música de fundo");
      });

      this.sounds.move = new Audio("midia/move.mp3"); // Som de movimento
      this.sounds.move.addEventListener("error", () => {
        console.warn("Não foi possível carregar som de movimento");
      });

      this.sounds.food = new Audio("midia/food.mp3"); // Som de comida
      this.sounds.food.addEventListener("error", () => {
        console.warn("Não foi possível carregar som de comida");
      });

      this.sounds.gameOver = new Audio("midia/gameover.mp3"); // Som de game over
      this.sounds.gameOver.addEventListener("error", () => {
        console.warn("Não foi possível carregar som de game over");
      });
    } catch (error) {
      console.error("Erro ao carregar sons:", error);
    }
  }

  // Tocar som específico
  play(soundName) {
    if (this.sounds[soundName]) {
      try {
        this.sounds[soundName].currentTime = 0;
        this.sounds[soundName].play().catch((error) => {
          // Ignorar erros de autoplay (precisa de interação do usuário)
          if (error.name !== "NotAllowedError") {
            console.warn(`Erro ao tocar som ${soundName}:`, error);
          }
        });
      } catch (error) {
        console.warn(`Erro ao tocar som ${soundName}:`, error);
      }
    }
  }

  // Parar som específico
  stop(soundName) {
    if (this.sounds[soundName]) {
      this.sounds[soundName].pause();
      this.sounds[soundName].currentTime = 0;
    }
  }

  // Iniciar música de fundo
  startMusic() {
    // Tentar tocar música, mas pode falhar se não houver interação do usuário
    this.play("music");
  }

  // Parar música de fundo
  stopMusic() {
    this.stop("music");
  }
}
