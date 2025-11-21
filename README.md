# K0br1nha EPléPt1CA

- Jogo da cobrinha moderno em JavaScript com power-ups, obstáculos, trilha sonora e transições de cores.
- Foco em jogabilidade arcade, visual psicodélico e suporte a teclado e toque.

**Como Rodar**
- Abra `index.html` diretamente no navegador (Chrome, Edge ou Firefox).
- Para rodar via servidor estático, use qualquer servidor local e acesse `index.html`:
  - Exemplos: `npx serve .`, `npx http-server .`, ou `python -m http.server`.

**Controles**
- `Setas` ou `W/A/S/D`: mover a cobra.
- `Enter`: pausar/retomar durante a partida.
- `Botão "Faça a cobra nascer"` ou `Jogar`: inicia após a animação de introdução.

**Recursos**
- Power-ups com efeitos distintos: normal, dourada, venenosa, turbo e coringa.
- Obstáculos progressivos conforme a pontuação aumenta.
- Trilha sonora, efeitos sonoros e mensagens engraçadas in-game.
- Intro animada com múltiplas cobras reagindo ao mouse.
- Transições suaves de cor no fundo e corpo da cobra.

**Arquitetura (arquivo por arquivo)**
- `index.html`: estrutura de página, canvas e elementos de UI, importa `js/main.js`.
- `style/style.css`: estilos do jogo, animações de fundo, botões e menus.
- `js/main.js`: ponto de entrada. Classe `Game` cria e conecta módulos; inicializa input e intro (`js/main.js:14`, `js/main.js:46`, `js/main.js:83`).
- `js/modules/GameConfig.js`: constantes de configuração, tipos, direções, cores e mensagens.
- `js/modules/Utils.js`: utilitários de cor e desenho (`js/modules/Utils.js:20`), e fullscreen (`js/modules/Utils.js:35`).
- `js/modules/Snake.js`: estado e desenho da cobra. Movimento (`js/modules/Snake.js:26`), direção segura (`js/modules/Snake.js:97`), render com olhos (`js/modules/Snake.js:111`, `js/modules/Snake.js:148`).
- `js/modules/Food.js`: geração, tipos e render da comida (`js/modules/Food.js:11`, `js/modules/Food.js:54`, `js/modules/Food.js:94`).
- `js/modules/Obstacles.js`: geração e renderização de obstáculos (`js/modules/Obstacles.js:10`, `js/modules/Obstacles.js:43`).
- `js/modules/Score.js`: pontuação, thresholds e UI de score (`js/modules/Score.js:12`, `js/modules/Score.js:36`, `js/modules/Score.js:49`).
- `js/modules/Renderer.js`: limpeza, mensagens, transições de cor e countdown (`js/modules/Renderer.js:25`, `js/modules/Renderer.js:56`, `js/modules/Renderer.js:64`, `js/modules/Renderer.js:121`).
- `js/modules/SoundManager.js`: carregamento e controle de áudio (`js/modules/SoundManager.js:8`, `js/modules/SoundManager.js:38`, `js/modules/SoundManager.js:63`).
- `js/modules/GameState.js`: ciclo do jogo, colisões, efeitos de comida, pausa e intro (`js/modules/GameState.js:68`, `js/modules/GameState.js:116`, `js/modules/GameState.js:143`, `js/modules/GameState.js:209`, `js/modules/GameState.js:266`, `js/modules/GameState.js:296`).
- `js/modules/IntroAnimation.js`: animação de introdução e cobras reativas ao mouse (`js/modules/IntroAnimation.js:24`, `js/modules/IntroAnimation.js:44`).
- `js/modules/InputController.js`: teclado, toque e botões (`js/modules/InputController.js:21`, `js/modules/InputController.js:67`, `js/modules/InputController.js:114`).
- `js/backup_main.js`: versão monolítica legada com lógica integrada (útil como referência).
- `js/modularizar_teste.js`: protótipo de integração modular (similar ao `main.js`).

**Configuração do Jogo**
- `GAME_CONFIG` controla parâmetros principais:
  - `CANVAS_WIDTH`/`CANVAS_HEIGHT`: tamanho do canvas.
  - `GRID_SIZE`: tamanho da célula de movimento.
  - `INITIAL_SPEED`/`MIN_SPEED`/`SPEED_DECREASE`: cadence do loop em ms.
  - `POINTS_PER_FOOD`/`GOLDEN_FOOD_POINTS`: pontos por tipo de comida.
  - `SPEED_LEVEL_THRESHOLD`: pontos por aumento de dificuldade.
  - `OBSTACLE_LEVEL_THRESHOLD`: pontos por adição de obstáculos.
  - `TURBO_DURATION`/`TURBO_SPEED_MULTIPLIER`: parâmetros do turbo.

**Fluxo de Execução**
- Ao carregar: `Game` cria módulos e `InputController` (`js/main.js:46`, `js/main.js:30`).
- Intro: `GameState.startIntroAnimation()` exibe cobras e mostra botão `Jogar` (`js/modules/GameState.js:296`).
- Início: countdown (`js/modules/GameState.js:99`) e `initGame()` reseta estado e inicia `setInterval` (`js/modules/GameState.js:68`, `js/modules/GameState.js:94`).
- Loop: `gameStep()` atualiza cobra e comida, verifica colisões e desenha (`js/modules/GameState.js:266`).

**Assets**
- `midia/`: `music2.mp3`, `move.mp3`, `food.mp3`, `gameover.mp3`.
- `imgs/`: `favicon.png`.

**Personalização**
- Edite `js/modules/GameConfig.js` para ajustar velocidade, pontos e probabilidades.
- Troque cores em `snakeColors` e `backgroundColors`.
- Altere mensagens em `funnyMessages`.

**Créditos**
- Autor: `@spaceman.404` (Felipe Toledo).