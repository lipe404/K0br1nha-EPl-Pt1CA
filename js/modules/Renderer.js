/**
 * Gerencia toda a renderização visual do jogo
 * Canvas, cores, transições e elementos visuais
 */

import { backgroundColors } from './GameConfig.js';
import { hexToRgb } from './Utils.js';

export class Renderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.messageDisplay = document.getElementById('message-display');
        
        // Sistema de transição de cores
        this.targetBackgroundColor = backgroundColors[0];
        this.currentBackgroundColor = hexToRgb(backgroundColors[0]);
        this.colorTransitionProgress = 1;
        this.colorTransitionSpeed = 0.05;
        this.currentColorIndex = 0;
    }

    // Limpar canvas
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Iniciar transição de cor
    startColorTransition() {
        this.currentColorIndex = (this.currentColorIndex + 1) % backgroundColors.length;
        this.targetBackgroundColor = backgroundColors[this.currentColorIndex];
        this.colorTransitionProgress = 0;
    }

    // Atualizar transição de cores
    updateColors() {
        if (this.colorTransitionProgress < 1) {
            this.colorTransitionProgress += this.colorTransitionSpeed;
            
            // Converter cores alvo para RGB
            const targetRgb = hexToRgb(this.targetBackgroundColor);
            
            // Interpolar entre cores atual e alvo
            const r = Math.floor(this.currentBackgroundColor.r + (targetRgb.r - this.currentBackgroundColor.r) * this.colorTransitionProgress);
            const g = Math.floor(this.currentBackgroundColor.g + (targetRgb.g - this.currentBackgroundColor.g) * this.colorTransitionProgress);
            const b = Math.floor(this.currentBackgroundColor.b + (targetRgb.b - this.currentBackgroundColor.b) * this.colorTransitionProgress);
            
            // Atualizar cor atual e aplicar ao background
            this.currentBackgroundColor = {r, g, b};
            document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        }
    }

    // Resetar cores
    resetColors() {
        this.targetBackgroundColor = backgroundColors[0];
        this.currentBackgroundColor = hexToRgb(backgroundColors[0]);
        this.colorTransitionProgress = 1;
        this.currentColorIndex = 0;
        document.body.style.backgroundColor = backgroundColors[0];
    }

    // Mostrar mensagem
    showMessage(message, duration = 1500) {
        this.messageDisplay.textContent = message;
        this.messageDisplay.style.display = 'block';
        
        if (duration > 0) {
            setTimeout(() => {
                this.messageDisplay.style.display = 'none';
            }, duration);
        }
    }

    // Ocultar mensagem
    hideMessage() {
        this.messageDisplay.style.display = 'none';
    }

    // Desenhar contagem regressiva
    drawCountdown(countdown) {
        this.clear();
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 72px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(countdown, this.canvas.width / 2, this.canvas.height / 2);
    }
}