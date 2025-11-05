/**
 * Configurações globais e constantes do jogo
 * Centraliza todas as configurações para facilitar manutenção
 */

export const GAME_CONFIG = {
    CANVAS_WIDTH: 400,
    CANVAS_HEIGHT: 400,
    GRID_SIZE: 20,
    INITIAL_SPEED: 150,
    MIN_SPEED: 50,
    SPEED_DECREASE: 2,
    POINTS_PER_FOOD: 10,
    SPEED_LEVEL_THRESHOLD: 50,
    OBSTACLE_LEVEL_THRESHOLD: 100,
    GOLDEN_FOOD_POINTS: 50,
    TURBO_DURATION: 5000, // 5 segundos em milissegundos
    TURBO_SPEED_MULTIPLIER: 2
};

// Tipos de comida
export const FOOD_TYPES = {
    NORMAL: 'normal',
    GOLDEN: 'golden',
    POISON: 'poison',
    TURBO: 'turbo',
    JOKER: 'joker'
};

export const DIRECTIONS = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right'
};

// Cores do corpo da cobra
export const snakeColors = [
    '#4CAF50', '#FF5722', '#FFC107', '#FF9800', '#CDDC39',
    '#8BC34A', '#FFEB3B', '#FF4081', '#3F51B5', '#2196F3',
    '#00BCD4', '#009688', '#E91E63', '#9C27B0', '#673AB7'
];

// Cores de fundo do jogo
export const backgroundColors = [
    '#4CAF50', '#FF5722', '#FFC107', '#FF9800', '#CDDC39',
    '#8BC34A', '#FFEB3B', '#FF4081', '#3F51B5', '#2196F3',
    '#00BCD4', '#009688', '#E91E63', '#9C27B0', '#673AB7'
];

// Mensagens
export const funnyMessages = [
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