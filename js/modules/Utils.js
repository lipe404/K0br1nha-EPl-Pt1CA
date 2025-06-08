/**
 * Funções utilitárias reutilizáveis
 * Contém helpers para conversão de cores, desenho e outras operações comuns
 */

// Converter hex para RGB
export function hexToRgb(hex) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return {r, g, b};
}

// Escurecer cor
export function darkenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, (num >> 8 & 0x00FF) - amt);
    const B = Math.max(0, (num & 0x0000FF) - amt);
    return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
}

// Desenhar retângulo com bordas arredondadas
export function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

//Função para ativar o modo fullscreen
export function entrarEmTelaCheia() {
    const el = document.documentElement;
    if (el.requestFullscreen) {
        el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) { // Safari
        el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) { // IE/Edge antigos
        el.msRequestFullscreen();
    }
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            const pauseMenu = document.getElementById('pause-menu');
            if (pauseMenu) pauseMenu.style.display = 'block';
        }
    });
}