const TAMANHO_QUADRADO = 80;

const LINHAS = 8;
const COLUNAS = 8;

let tabuleiro = [];

let pecaSelecionada = null;

let turno = 'Cation';

let placarCompostos = [];

function setup() {

  let canvas = createCanvas(800, 640);

  canvas.parent("game-container");

  inicializarTabuleiro();
}

function draw() {

  background(240);

  desenharTabuleiro();

  desenharPecas();

  desenharPlacar();
}

function inicializarTabuleiro() {

  tabuleiro = [];

  placarCompostos = [];

  turno = 'Cation';

  pecaSelecionada = null;

  // Criar matriz vazia
  for (let l = 0; l < LINHAS; l++) {

    tabuleiro[l] = new Array(COLUNAS).fill(null);
  }

  // Ânions
  let anions = ['Cl⁻', 'O²⁻', 'F⁻'];

  for (let l = 0; l < 3; l++) {

    for (let c = 0; c < COLUNAS; c++) {

      if ((l + c) % 2 === 1) {

        let elemento = random(anions);

        tabuleiro[l][c] = {

          tipo: 'Anion',

          elemento: elemento,

          carga: obterCarga(elemento)
        };
      }
    }
  }

  // Cátions
  let cations = ['Na⁺', 'Mg²⁺', 'K⁺'];

  for (let l = 5; l < 8; l++) {

    for (let c = 0; c < COLUNAS; c++) {

      if ((l + c) % 2 === 1) {

        let elemento = random(cations);

        tabuleiro[l][c] = {

          tipo: 'Cation',

          elemento: elemento,

          carga: obterCarga(elemento)
        };
      }
    }
  }
}

function obterCarga(elemento) {

  if (elemento.includes('Na⁺') || elemento.includes('K⁺')) return 1;

  if (elemento.includes('Mg²⁺')) return 2;

  if (elemento.includes('Cl⁻') || elemento.includes('F⁻')) return -1;

  if (elemento.includes('O²⁻')) return -2;

  return 0;
}

function desenharTabuleiro() {

  for (let l = 0; l < LINHAS; l++) {

    for (let c = 0; c < COLUNAS; c++) {

      if ((l + c) % 2 === 0) {

        fill(255);

      } else {

        fill(100, 150, 105);
      }

      stroke(0);

      rect(
        c * TAMANHO_QUADRADO,
        l * TAMANHO_QUADRADO,
        TAMANHO_QUADRADO,
        TAMANHO_QUADRADO
      );
    }
  }
}

function desenharPecas() {

  for (let l = 0; l < LINHAS; l++) {

    for (let c = 0; c < COLUNAS; c++) {

      let peca = tabuleiro[l][c];

      if (peca) {

        // Cor da peça
        if (peca.tipo === 'Cation') {

          fill(66, 135, 245);

        } else {

          fill(235, 64, 52);
        }

        // Selecionada
        if (
          pecaSelecionada &&
          pecaSelecionada.l === l &&
          pecaSelecionada.c === c
        ) {

          stroke(255, 215, 0);

          strokeWeight(4);

        } else {

          stroke(0);

          strokeWeight(1);
        }

        let x = c * TAMANHO_QUADRADO + TAMANHO_QUADRADO / 2;

        let y = l * TAMANHO_QUADRADO + TAMANHO_QUADRADO / 2;

        circle(x, y, TAMANHO_QUADRADO * 0.8);

        // Texto
        fill(255);

        noStroke();

        textAlign(CENTER, CENTER);

        textSize(16);

        text(peca.elemento, x, y);

        strokeWeight(1);
      }
    }
  }
}

function desenharPlacar() {

  fill(0);

  noStroke();

  textSize(18);

  textAlign(LEFT, TOP);

  text("REAÇÕES QUÍMICAS", 660, 20);

  textSize(14);

  text(
    `Turno: ${
      turno === 'Cation'
      ? 'Cátions (Azul)'
      : 'Ânions (Vermelho)'
    }`,
    660,
    50
  );

  stroke(0);

  line(650, 80, 790, 80);

  noStroke();

  text("Compostos Formados:", 660, 100);

  for (let i = 0; i < placarCompostos.length; i++) {

    text(
      `• ${placarCompostos[i]}`,
      660,
      130 + (i * 22)
    );
  }
}

function mousePressed() {

  let c = floor(mouseX / TAMANHO_QUADRADO);

  let l = floor(mouseY / TAMANHO_QUADRADO);

  // Fora do tabuleiro
  if (c >= COLUNAS || l >= LINHAS) return;

  let pecaClicada = tabuleiro[l][c];

  // Selecionar peça
  if (pecaClicada && pecaClicada.tipo === turno) {

    pecaSelecionada = {

      l,
      c,
      peca: pecaClicada
    };

  } else if (pecaSelecionada) {

    // Mover
    if (
      validarMovimento(
        pecaSelecionada.l,
        pecaSelecionada.c,
        l,
        c
      )
    ) {

      executarMovimento(
        pecaSelecionada.l,
        pecaSelecionada.c,
        l,
        c
      );

      pecaSelecionada = null;

      turno =
        turno === 'Cation'
        ? 'Anion'
        : 'Cation';
    }
  }
}

function validarMovimento(
  lOrigem,
  cOrigem,
  lDestino,
  cDestino
) {

  if (tabuleiro[lDestino][cDestino] !== null) return false;

  let difL = lDestino - lOrigem;

  let difC = abs(cDestino - cOrigem);

  let peca = tabuleiro[lOrigem][cOrigem];

  // Movimento simples
  if (
    peca.tipo === 'Cation' &&
    difL === -1 &&
    difC === 1
  ) return true;

  if (
    peca.tipo === 'Anion' &&
    difL === 1 &&
    difC === 1
  ) return true;

  // Captura
  if (abs(difL) === 2 && difC === 2) {

    let lMeio = lOrigem + difL / 2;

    let cMeio = cOrigem + (cDestino - cOrigem) / 2;

    let pecaMeio = tabuleiro[lMeio][cMeio];

    if (
      pecaMeio &&
      pecaMeio.tipo !== peca.tipo
    ) {

      return true;
    }
  }

  return false;
}

function executarMovimento(
  lOrigem,
  cOrigem,
  lDestino,
  cDestino
) {

  let pecaAtacante = tabuleiro[lOrigem][cOrigem];

  let difL = lDestino - lOrigem;

  // Captura
  if (abs(difL) === 2) {

    let lMeio = lOrigem + difL / 2;

    let cMeio = cOrigem + (cDestino - cOrigem) / 2;

    let pecaDefensora = tabuleiro[lMeio][cMeio];

    // Reação química
    reacaoQuimica(
      pecaAtacante,
      pecaDefensora
    );

    // Remove peça capturada
    tabuleiro[lMeio][cMeio] = null;
  }

  // Movimento
  tabuleiro[lDestino][cDestino] = pecaAtacante;

  tabuleiro[lOrigem][cOrigem] = null;
}

function reacaoQuimica(p1, p2) {

  let cation =
    p1.tipo === 'Cation'
    ? p1
    : p2;

  let anion =
    p1.tipo === 'Anion'
    ? p1
    : p2;

  // Remove símbolos
  let nomeCation = cation.elemento.replace(/[\⁺\²]/g, '');

  let nomeAnion = anion.elemento.replace(/[\⁻\²]/g, '');

  let absCargaCation = abs(cation.carga);

  let absCargaAnion = abs(anion.carga);

  let formula = "";

  // Regra da cruz
  if (absCargaCation === absCargaAnion) {

    formula = nomeCation + nomeAnion;

  } else {

    let subCation =
      absCargaAnion > 1
      ? absCargaAnion
      : "";

    let subAnion =
      absCargaCation > 1
      ? absCargaCation
      : "";

    formula =
      `${nomeCation}${subCation}${nomeAnion}${subAnion}`;
  }

  placarCompostos.push(formula);
}

function reiniciarJogo() {

  inicializarTabuleiro();
}