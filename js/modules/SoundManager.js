/**
 * Gerencia todos os sons do jogo
 * Música de fundo, efeitos sonoros e controle de volume
 */

export class SoundManager {
    constructor() {
        this.sounds = {};
        this.loadSounds();
    }

    // Carregar todos os sons
    loadSounds() {
        //Sons do jogo
        this.sounds.music = new Audio('midia/music2.mp3');
        this.sounds.music.loop = true;
        this.sounds.music.volume = 0.3; // Volume inicial
        
        this.sounds.move = new Audio('midia/move.mp3'); // Som de movimento
        this.sounds.food = new Audio('midia/food.mp3'); // Som de comida
        this.sounds.gameOver = new Audio('midia/gameover.mp3'); // Som de game over
    }

    // Tocar som específico
    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play();
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
        this.play('music');
    }

    // Parar música de fundo
    stopMusic() {
        this.stop('music');
    }
}