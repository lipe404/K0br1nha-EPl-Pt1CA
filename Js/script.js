/**
 * Jogo da Cobrinha com animações de cores, mensagens cômicas, e design visual aprimorado.
 * Desenvolvido por Felipe Toledo @spaceman.404.
 *
 * Melhorias incluídas neste código:
 * - Comentários explicativos para cada função e bloco lógico
 * - Otimizações de estrutura e modularização
 * - Adição de transição de cores ao longo do jogo
 * - Adição de mensagens humorísticas ao longo do jogo
 * - Melhoria na lógica de colisão
 * - Melhoria na lógica de pontuação e aumento de dificuldade
 * - Melhoria na lógica de animação da cobra
 * - Melhoria na lógica de obstáculos
 */
// Configurações do jogo
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const messageDisplay = document.getElementById('message-display');
const startButton = document.getElementById('start-button');
// Criar elemento de pontuação
const scoreDisplay = document.createElement('div');
scoreDisplay.id = 'score-display';
document.body.insertBefore(scoreDisplay, startButton);
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
playButton.style.display = 'flex'; // Só aparece na intro
document.body.appendChild(playButton);
document.body.appendChild(pauseMenu);
// Variáveis do loop de introdução
let introSnakes = [];
let introAnimationLoop;
let isIntroRunning = true;
// Variáveis do jogo
let snake = []; // Armazena os segmentos da cobrinha
let food = {}; // Posição da comida
let direction = 'right'; // Direção atual
let nextDirection = 'right'; // Próxima direção
let gameSpeed = 150; // Velocidade inicial do jogo
let speedLevel = 0; // Nível de velocidade
let score = 0; // Pontuação inicial
let gameLoop; // Loop do jogo
let isGameOver = false; // Flag de fim de jogo
let isGamePaused = false; // Flag de pausa
let currentColorIndex = 0; // Índice da cor atual
let obstacles = []; // Obstáculos
// Posição do mouse para animação de intro
let mouse = { x: null, y: null };
// Cores do corpo da cobra
const snakeColors = [
    '#4CAF50', '#FF5722', '#FFC107', '#FF9800', '#CDDC39',
    '#8BC34A', '#FFEB3B', '#FF4081', '#3F51B5', '#2196F3',
    '#00BCD4', '#009688', '#E91E63', '#9C27B0', '#673AB7'
];
// Cores de fundo do jogo
const backgroundColors = [
    '#4CAF50', '#FF5722', '#FFC107', '#FF9800', '#CDDC39',
    '#8BC34A', '#FFEB3B', '#FF4081', '#3F51B5', '#2196F3',
    '#00BCD4', '#009688', '#E91E63', '#9C27B0', '#673AB7'
];
// Sistema de transição de cores
let targetBackgroundColor = backgroundColors[0];
let currentBackgroundColor = hexToRgb(backgroundColors[0]);
let colorTransitionProgress = 1;
const colorTransitionSpeed = 0.05;
// Mensagens
const funnyMessages = [
    "Tem uma cobra nas minhas botas!",
    "Nhami nhami, delícia!",
    "Isso vai crescer seu rabo!",
    "Fumando leite!",
    "Você é o que você come!",
    "Estou ficando ereto!",
    "Comida de cobra é isso mesmo?",
    "Cuidado! Essa cobra é um vírus!",
    "Miau Miau Miau Miau",
    "Bebeu água hoje?",
    "Venha Venha vamos exercitar...",
    "Lá ele mil vezes",
    "Cobrinha, entra na minha casa!",
    "Pula boi pula boiada!",
    "Academiaaaa das maravilhaaaas"
];
//Sons do jogo
const music = new Audio('midia/music2.mp3');
music.loop = true;
music.volume = 0.3; // Volume inicial
const moveSound = new Audio('midia/move.mp3'); // Som de movimento
const foodSound = new Audio('midia/food.mp3'); // Som de comida
const gameOverSound = new Audio('midia/gameover.mp3'); // Som de game over
// Inicializar o jogo
function initGame() {
    // Resetar cobra (3 segmentos)
    snake = [
        {x: 160, y: 200},
        {x: 140, y: 200},
        {x: 120, y: 200}
    ];
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    speedLevel = 0;
    gameSpeed = 150;
    currentColorIndex = 0;
    isGameOver = false;
    isGamePaused = false;
    obstacles = [];
    // Resetar cores
    targetBackgroundColor = backgroundColors[0];
    currentBackgroundColor = hexToRgb(backgroundColors[0]);
    colorTransitionProgress = 1;
    document.body.style.backgroundColor = backgroundColors[0];
    // Atualizar UI
    scoreDisplay.textContent = `Pontuação: ${score}`;
    messageDisplay.style.display = 'none';
    pauseMenu.style.display = 'none';
    // Gerar primeira comida
    generateFood();
    // Limpar qualquer jogo anterior e iniciar novo
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(gameStep, gameSpeed);
    music.play();
}
// Função de introdução
function startIntroAnimation() {
    // Criar cobras
    introSnakes = Array.from({ length: 15 }, () => new IntroSnake());
    introAnimationLoop = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        introSnakes.forEach(snake => {
            snake.update();
            snake.draw(ctx);
        });
    }, 1000 / 60); // 60 FPS
    playButton.style.display = 'block';
}
// Cobras de introdução
class IntroSnake {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.direction = Math.random() * 2 * Math.PI;
        this.speed = 1 + Math.random() * 2;
        this.length = 10 + Math.floor(Math.random() * 5);
        this.segments = Array.from({ length: this.length }, (_, i) => ({
            x: this.x - i * 10 * Math.cos(this.direction),
            y: this.y - i * 10 * Math.sin(this.direction)
        }));
        this.color = snakeColors[Math.floor(Math.random() * snakeColors.length)];
        this.scared = false;
        this.scareTimer = 0;
    }
    update() {
        const dx = Math.cos(this.direction) * this.speed;
        const dy = Math.sin(this.direction) * this.speed;
        this.x += dx;
        this.y += dy;
        // Rebater nas bordas
        if (this.x < 0 || this.x > canvas.width) this.direction = Math.PI - this.direction;
        if (this.y < 0 || this.y > canvas.height) this.direction = -this.direction;
        // Interação com o mouse (efeito de fuga)
        if (mouse.x !== null && mouse.y !== null) {
            const distX = this.x - mouse.x;
            const distY = this.y - mouse.y;
            const distance = Math.sqrt(distX * distX + distY * distY);
            const escapeRadius = 80;
            if (distance < escapeRadius) {
                // Direção oposta ao mouse
                this.direction = Math.atan2(distY, distX) + (Math.random() - 0.5) * 0.5;
                this.scared = true;
                this.scareTimer = 10;
            }
        }
        // Contagem decrescente do susto
        if (this.scareTimer > 0) {
            this.scareTimer--;
        } else {
            this.scared = false;
        }
        // Atualizar segmentos
        this.segments.pop();
        this.segments.unshift({ x: this.x, y: this.y });
    }
    draw(ctx) {
        ctx.lineWidth = 1;
        this.segments.forEach((seg, i) => {
            // Efeito de susto: brilho e vibração
            let offsetX = 0, offsetY = 0;
            let color = this.color;
            if (this.scared) {
                offsetX = (Math.random() - 0.5) * 4; // vibração leve
                offsetY = (Math.random() - 0.5) * 4;
                color = 'white'; // flash branco
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 15;
            } else {
                ctx.shadowBlur = 0;
            }
            ctx.fillStyle = color;
            ctx.strokeStyle = '#111';
            ctx.beginPath();
            roundRect(ctx, seg.x + offsetX, seg.y + offsetY, 10, 10, 3);
            ctx.fill();
            ctx.stroke();
        });
    }
}
// Contagem regressiva
function startCountdownAndGame() {
    clearInterval(introAnimationLoop);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let countdown = 3;
    const countdownInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 72px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(countdown, canvas.width / 2, canvas.height / 2);
        countdown--;
        if (countdown < 0) {
            clearInterval(countdownInterval);
            isIntroRunning = false;
            initGame(); // Inicia o jogo real
        }
    }, 1000);
}
// Ajustar velocidade do jogo
function adjustGameSpeed() {
    // A cada 50 pontos, aumenta o nível de dificuldade
    const newLevel = Math.floor(score / 50);
    // Só atualiza se mudou de nível
    if (newLevel > speedLevel) {
        speedLevel = newLevel;
        gameSpeed = Math.max(50, gameSpeed - 10); // Diminui a velocidade, mínimo 50ms
        clearInterval(gameLoop);
        gameLoop = setInterval(gameStep, gameSpeed);
    }
    // A cada 100 pontos, adicionar obstáculos
    const level = Math.floor(score / 100);
    if (level > 0 && score % 100 === 0) {
        generateObstacles(level);
    }
}
// Função para gerar obstáculos
function generateObstacles(level) {
    const gridSize = canvas.width / 20;
    const numObstacles = level * 3; // Número de obstáculos cresce com o nível
    obstacles = []; // Resetar obstáculos
    for (let i = 0; i < numObstacles; i++) {
        let valid = false;
        let newX, newY;
        while (!valid) {
            newX = Math.floor(Math.random() * gridSize) * 20;
            newY = Math.floor(Math.random() * gridSize) * 20;
            valid = true;
            // Impedir sobreposição com a cobra
            for (const segment of snake) {
                if (segment.x === newX && segment.y === newY) {
                    valid = false;
                    break;
                }
            }
            // Impedir sobreposição com a comida
            if (food.x === newX && food.y === newY) {
                valid = false;
            }
        }
        obstacles.push({x: newX, y: newY});
    }
}
// Desenhar obstáculos
function drawObstacles() {
    ctx.fillStyle = '#555';
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    obstacles.forEach(ob => {
        ctx.beginPath();
        roundRect(ctx, ob.x, ob.y, 20, 20, 5);
        ctx.fill();
        ctx.stroke();
    });
}
// Gerar comida em posição aleatória
function generateFood() {
    const gridSize = canvas.width / 20;
    let validPosition = false;
    let newX, newY;
    // Garantir que a comida não apareça em cima da cobra
    while (!validPosition) {
        newX = Math.floor(Math.random() * gridSize) * 20;
        newY = Math.floor(Math.random() * gridSize) * 20;
        validPosition = true;
        for (const segment of snake) {
            if (segment.x === newX && segment.y === newY) {
                validPosition = false;
                break;
            }
        }
    }
    food = {x: newX, y: newY};
}
// Desenhar a cobra (versão multicolorida)
function drawSnake() {
    snake.forEach((segment, index) => {
        // Cada segmento tem uma cor baseada em sua posição
        const segmentColorIndex = (currentColorIndex + index) % snakeColors.length;
        const color = index === 0 ?
            darkenColor(snakeColors[segmentColorIndex], 20) :
            snakeColors[segmentColorIndex];
        // Desenhar segmento
        ctx.fillStyle = color;
        ctx.strokeStyle = '#2E7D32';
        ctx.lineWidth = 2;
        // Segmento com bordas arredondadas
        ctx.beginPath();
        roundRect(ctx, segment.x, segment.y, 20, 20, 5);
        ctx.fill();
        ctx.stroke();
        // Desenhar olhos na cabeça
        if (index === 0) {
            drawEyes(segment);
        }
    });
}
// Desenhar os olhos da cobra
function drawEyes(head) {
    ctx.fillStyle = '#000';
    let leftEye = {x: head.x + 4, y: head.y + 5};
    let rightEye = {x: head.x + 12, y: head.y + 5};
    // Ajustar posição dos olhos baseado na direção
    if (direction === 'up') {
        leftEye = {x: head.x + 5, y: head.y + 4};
        rightEye = {x: head.x + 15, y: head.y + 4};
    } else if (direction === 'down') {
        leftEye = {x: head.x + 5, y: head.y + 16};
        rightEye = {x: head.x + 15, y: head.y + 16};
    } else if (direction === 'left') {
        leftEye = {x: head.x + 4, y: head.y + 5};
        rightEye = {x: head.x + 4, y: head.y + 15};
    }
    // Desenhar olhos
    ctx.beginPath();
    ctx.arc(leftEye.x, leftEye.y, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(rightEye.x, rightEye.y, 2, 0, Math.PI * 2);
    ctx.fill();
}
// Desenhar comida
function drawFood() {
    ctx.fillStyle = '#FF5252';
    ctx.strokeStyle = '#D32F2F';
    ctx.lineWidth = 2;
    // Comida redonda
    ctx.beginPath();
    ctx.arc(food.x + 10, food.y + 10, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
}
// Atualizar posição da cobra
function updateSnake() {
    // Atualizar direção
    direction = nextDirection;
    // Calcular nova posição da cabeça
    const head = {x: snake[0].x, y: snake[0].y};
    switch (direction) {
        case 'up': head.y -= 20; break;
        case 'down': head.y += 20; break;
        case 'left': head.x -= 20; break;
        case 'right': head.x += 20; break;
    }
    // Adicionar nova cabeça
    snake.unshift(head);
    // Verificar se comeu comida
    if (checkFoodCollision()) {
        handleFoodEaten();
    } else {
        // Remover cauda se não comeu
        snake.pop();
    }
}
// Lógica quando a cobra come a comida
function handleFoodEaten() {
    // Tocar som de comida
    foodSound.currentTime = 0;
    foodSound.play();
    // Aumentar pontuação
    score += 10;
    scoreDisplay.textContent = `Pontuação: ${score}`;
    // Iniciar transição de cor
    currentColorIndex = (currentColorIndex + 1) % backgroundColors.length;
    targetBackgroundColor = backgroundColors[currentColorIndex];
    colorTransitionProgress = 0;
    // Aumentar velocidade (com limite mínimo)
    gameSpeed = Math.max(50, gameSpeed - 2);
    clearInterval(gameLoop);
    gameLoop = setInterval(gameStep, gameSpeed);
    // Mostrar mensagem e gerar nova comida
    adjustGameSpeed(); // Aqui ocorre o aumento de dificuldade progressivo
    showRandomMessage();
    generateFood();
}
// Atualizar transição de cores
function updateColors() {
    if (colorTransitionProgress < 1) {
        colorTransitionProgress += colorTransitionSpeed;
        // Converter cores alvo para RGB
        const targetRgb = hexToRgb(targetBackgroundColor);
        // Interpolar entre cores atual e alvo
        const r = Math.floor(currentBackgroundColor.r + (targetRgb.r - currentBackgroundColor.r) * colorTransitionProgress);
        const g = Math.floor(currentBackgroundColor.g + (targetRgb.g - currentBackgroundColor.g) * colorTransitionProgress);
        const b = Math.floor(currentBackgroundColor.b + (targetRgb.b - currentBackgroundColor.b) * colorTransitionProgress);
        // Atualizar cor atual e aplicar ao background
        currentBackgroundColor = {r, g, b};
        document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    }
}
// Verificar colisão com comida
function checkFoodCollision() {
    return snake[0].x === food.x && snake[0].y === food.y;
}
// Verificar colisões com paredes ou próprio corpo
function checkCollisions() {
    const head = snake[0];
    // Colisão com parede
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height) {
        gameOverSound.play();
        music.pause();
        music.currentTime = 0;
        gameOver("TCHOOOLAAA!");
        return true;
    }
    // Colisão com próprio corpo (ignorando a cabeça)
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOverSound.play();
            music.pause();
            music.currentTime = 0;
            gameOver("É UM OROBOROS NÉ!");
            return true;
        }
    }
    // Colisão com obstáculos
    for (const ob of obstacles) {
        if (head.x === ob.x && head.y === ob.y) {
            gameOverSound.play();
            music.pause();
            music.currentTime = 0;
            gameOver("VOCÊ BATEU EM UM BLOCO!");
            return true;
        }
    }
    return false;
}
// Mostrar mensagem aleatória
function showRandomMessage() {
    const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
    messageDisplay.textContent = randomMessage;
    messageDisplay.style.display = 'block';
    setTimeout(() => {
        messageDisplay.style.display = 'none';
    }, 1500);
}
// Fim de jogo
function gameOver(message) {
    isGameOver = true;
    clearInterval(gameLoop);
    messageDisplay.textContent = `${message} Pontuação final: ${score}`;
    messageDisplay.style.display = 'block';
}
// Loop principal do jogo
function gameStep() {
    if (isGameOver) return;
    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Atualizar elementos
    updateSnake();
    updateColors();
    // Verificar colisões
    if (checkCollisions()) return;
    // Desenhar elementos
    drawFood();
    drawSnake();
    drawObstacles();
}
// Converter hex para RGB
function hexToRgb(hex) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return {r, g, b};
}
// Escurecer cor
function darkenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, (num >> 8 & 0x00FF) - amt);
    const B = Math.max(0, (num & 0x0000FF) - amt);
    return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
}
// Desenhar retângulo com bordas arredondadas
function roundRect(ctx, x, y, width, height, radius) {
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
// Controles do teclado
document.addEventListener('keydown', (e) => {
    // Prevenir movimento inverso
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (direction !== 'down') nextDirection = 'up';
            moveSound.currentTime = 0;
            moveSound.play();
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (direction !== 'up') nextDirection = 'down';
            moveSound.currentTime = 0;
            moveSound.play();
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (direction !== 'right') nextDirection = 'left';
            moveSound.currentTime = 0;
            moveSound.play();
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (direction !== 'left') nextDirection = 'right';
            moveSound.currentTime = 0;
            moveSound.play();
            break;
    }
});
// Botão de início
startButton.addEventListener('click', () => {
    if (!isGameOver && !isIntroRunning) return;
    startCountdownAndGame();
});
playButton.addEventListener('click', () => {
    playButton.style.display = 'none';
    startCountdownAndGame();
});
// Botão de pause/retomar
window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !isIntroRunning && !isGameOver) {
        togglePauseGame();
    }
});
//Função para pausar o jogo
function togglePauseGame() {
    isGamePaused = !isGamePaused;
    if (isGamePaused) {
        clearInterval(gameLoop);
        pauseMenu.style.display = 'block';
    } else {
        pauseMenu.style.display = 'none';
        gameLoop = setInterval(gameStep, gameSpeed);
    }
}
document.getElementById('resume-button').addEventListener('click', () => {
    togglePauseGame();
});

document.getElementById('restart-button').addEventListener('click', () => {
    pauseMenu.style.display = 'none';
    isGameOver = true;
    startCountdownAndGame();
});
// Mensagem inicial
messageDisplay.textContent = "Arraste o dedo no touch para mover a cobra, ou use as setas do teclado";
messageDisplay.style.display = 'block';
// Iniciar animação de introdução
window.onload = () => {
    startIntroAnimation();
};
canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});
// Variáveis para capturar coordenadas do toque
let touchStartX = 0;
let touchStartY = 0;
// Capturar início do toque
document.addEventListener('touchstart', function (e) {
    e.preventDefault();
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}, false);
// Capturar fim do toque e calcular direção
document.addEventListener('touchend', function (e) {
    e.preventDefault();
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy)) {
        // Movimento horizontal
        if (dx > 30 && direction !== 'left') {
            nextDirection = 'right';
            moveSound.currentTime = 0;
            moveSound.play();
        } else if (dx < -30 && direction !== 'right') {
            nextDirection = 'left';
            moveSound.currentTime = 0;
            moveSound.play();
        }
    } else {
        // Movimento vertical
        if (dy > 30 && direction !== 'up') {
            nextDirection = 'down';
            moveSound.currentTime = 0;
            moveSound.play();
        } else if (dy < -30 && direction !== 'down') {
            nextDirection = 'up';
            moveSound.currentTime = 0;
            moveSound.play();
        }
    }
}, false);
// === SUGESTÕES DE MELHORIAS ===
/**
 * 5. Controle por toque: suportar mobile com gestos.
 */