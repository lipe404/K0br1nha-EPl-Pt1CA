// Configurações do jogo
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const messageDisplay = document.getElementById('message-display');
const startButton = document.getElementById('start-button');
// Criar elemento de pontuação
const scoreDisplay = document.createElement('div');
scoreDisplay.id = 'score-display';
document.body.insertBefore(scoreDisplay, startButton);
// Variáveis do jogo
let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let gameSpeed = 150;
let score = 0;
let gameLoop;
let isGameOver = false;
let currentColorIndex = 0;
// Cores
const snakeColors = [
    '#4CAF50', '#FF5722', '#FFC107', '#FF9800', '#CDDC39', 
    '#8BC34A', '#FFEB3B', '#FF4081', '#3F51B5', '#2196F3',
    '#00BCD4', '#009688', '#E91E63', '#9C27B0', '#673AB7'
];
const backgroundColors = [
    '#f0f8ff', '#ffebee', '#e8f5e9', '#e3f2fd', '#f3e5f5',
    '#fffde7', '#e0f7fa', '#fce4ec', '#e8eaf6', '#fff3e0'
];
// Sistema de transição de cores
let targetBackgroundColor = backgroundColors[0];
let currentBackgroundColor = hexToRgb(backgroundColors[0]);
let colorTransitionProgress = 1;
const colorTransitionSpeed = 0.05;
// Mensagens humorísticas
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
    gameSpeed = 150;
    currentColorIndex = 0;
    isGameOver = false;
    // Resetar cores
    targetBackgroundColor = backgroundColors[0];
    currentBackgroundColor = hexToRgb(backgroundColors[0]);
    colorTransitionProgress = 1;
    document.body.style.backgroundColor = backgroundColors[0];
    // Atualizar UI
    scoreDisplay.textContent = `Pontuação: ${score}`;
    messageDisplay.style.display = 'none';
    // Gerar primeira comida
    generateFood();
    // Limpar qualquer jogo anterior e iniciar novo
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(gameStep, gameSpeed);
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
        gameOver("TCHOOOLAAA!");
        return true;
    }
    // Colisão com próprio corpo (ignorando a cabeça)
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver("É UM OROBOROS NÉ!");
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
}
// Funções auxiliares

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
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (direction !== 'up') nextDirection = 'down';
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (direction !== 'right') nextDirection = 'left';
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (direction !== 'left') nextDirection = 'right';
            break;
    }
});
// Botão de início
startButton.addEventListener('click', initGame);
// Mensagem inicial
messageDisplay.textContent = "Clique em 'Faça a cobra nascer' para jogar!";
messageDisplay.style.display = 'block';