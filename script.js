/**
 * CÉREBRO MATEMÁTICO - ESTATÍSTICA PURA
 * Decisão binária baseada em Poisson: Gols (Over/Ambos) ou Resultado (Favorito/Dupla Chance)
 */

function fatorial(n) {
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
}

function poisson(k, lambda) {
    return (Math.exp(-lambda) * Math.pow(lambda, k)) / fatorial(k);
}

function calcular() {
    // 1. Captura de Dados (Médias L5)
    const mediaLiga = parseFloat(document.getElementById('mediaLiga').value) / 2;
    const gpA = parseFloat(document.getElementById('gpCasa').value);
    const gsA = parseFloat(document.getElementById('gsCasa').value);
    const gpB = parseFloat(document.getElementById('gpFora').value);
    const gsB = parseFloat(document.getElementById('gsFora').value);

    // Validação
    if (isNaN(gpA) || isNaN(gsA) || isNaN(gpB) || isNaN(gsB)) {
        alert("Por favor, preencha todas as médias dos últimos 5 jogos.");
        return;
    }

    // 2. Expectativa de Gols (Lambda)
    const lambdaA = (gpA * gsB) / mediaLiga;
    const lambdaB = (gpB * gsA) / mediaLiga;

    // 3. Cálculo de Probabilidades de Gols
    const btts = (1 - poisson(0, lambdaA)) * (1 - poisson(0, lambdaB)) * 100;

    let under25 = 0;
    for (let i = 0; i <= 2; i++) {
        for (let j = 0; j <= 2; j++) {
            if (i + j < 3) under25 += poisson(i, lambdaA) * poisson(j, lambdaB);
        }
    }
    const over25 = (1 - under25) * 100;

    // 4. Cálculo de Probabilidades de Resultado Final
    let pVitA = 0, pEmpate = 0, pVitB = 0;
    for (let i = 0; i <= 6; i++) {
        for (let j = 0; j <= 6; j++) {
            let pPlacar = poisson(i, lambdaA) * poisson(j, lambdaB);
            if (i > j) pVitA += pPlacar;
            else if (i === j) pEmpate += pPlacar;
            else pVitB += pPlacar;
        }
    }
    pVitA *= 100; pEmpate *= 100; pVitB *= 100;

    // 5. CÉREBRO DE DECISÃO (Hierarquia de Confiança)
    let veredito = "", chance = 0, cor = "";

    // PRIORIDADE 1: MERCADOS DE GOLS (Min. 50%)
    if (over25 >= btts && over25 >= 50) {
        veredito = "OVER 2.5 GOLS";
        chance = over25;
        cor = "#00d4ff"; // Azul
    } else if (btts >= 50) {
        veredito = "AMBOS MARCAM";
        chance = btts;
        cor = "#4ecca3"; // Verde
    }
    // PRIORIDADE 2: RESULTADO FINAL (Favorito ou Dupla Chance)
    else {
        cor = "#ffcc00"; // Amarelo
        if (pVitA >= 50) {
            veredito = "FAVORITO: TIME A";
            chance = pVitA;
        } else if (pVitB >= 50) {
            veredito = "FAVORITO: TIME B";
            chance = pVitB;
        } else if (pVitA + pEmpate >= 70) {
            veredito = "DUPLA CHANCE: A OU EMPATE";
            chance = pVitA + pEmpate;
        } else if (pVitB + pEmpate >= 70) {
            veredito = "DUPLA CHANCE: B OU EMPATE";
            chance = pVitB + pEmpate;
        } else {
            veredito = "SEM TENDÊNCIA CLARA";
            chance = pEmpate;
            cor = "#ff4d4d"; // Vermelho
        }
    }

    // 6. Exibição dos Resultados
    const output = document.getElementById('output');
    output.style.display = "block";
    output.style.borderColor = cor;

    const resVeredito = document.getElementById('resultadoVeredito');
    resVeredito.innerText = veredito;
    resVeredito.style.color = cor;

    const resProb = document.getElementById('probabilidadeFinal');
    resProb.innerText = chance.toFixed(2) + "%";
    resProb.style.color = cor;
}







