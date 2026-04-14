function fatorial(n) {
    if (n === 0 || n === 1) return 1;
    let res = 1; for (let i = 2; i <= n; i++) res *= i;
    return res;
}

function poisson(k, lambda) {
    return (Math.exp(-lambda) * Math.pow(lambda, k)) / fatorial(k);
}

function calcular() {
    const mediaLiga = parseFloat(document.getElementById('mediaLiga').value) / 2;
    const gpA = parseFloat(document.getElementById('gpCasa').value);
    const gsA = parseFloat(document.getElementById('gsCasa').value);
    const gpB = parseFloat(document.getElementById('gpFora').value);
    const gsB = parseFloat(document.getElementById('gsFora').value);

    if (isNaN(gpA) || isNaN(gsA) || isNaN(gpB) || isNaN(gsB)) {
        alert("Preencha as médias dos últimos 5 jogos."); return;
    }

    const lambdaA = (gpA * gsB) / mediaLiga;
    const lambdaB = (gpB * gsA) / mediaLiga;

    // 1. Probabilidades de Gols
    const btts = (1 - poisson(0, lambdaA)) * (1 - poisson(0, lambdaB)) * 100;
    let under25 = 0;
    for (let i = 0; i <= 2; i++) {
        for (let j = 0; j <= 2; j++) {
            if (i + j < 3) under25 += poisson(i, lambdaA) * poisson(j, lambdaB);
        }
    }
    const over25 = (1 - under25) * 100;

    // 2. Probabilidades de Resultado (A, B ou Empate)
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

    // --- CÉREBRO DE DECISÃO ---
    let veredito = "", chance = 0, cor = "";

    // PRIORIDADE 1: MERCADO DE GOLS
    if (over25 >= btts && over25 >= 50) {
        veredito = "OVER 2.5 GOLS";
        chance = over25;
        cor = "#00d4ff"; // Azul
    } else if (btts >= 50) {
        veredito = "AMBOS MARCAM";
        chance = btts;
        cor = "#4ecca3"; // Verde
    }
    // PRIORIDADE 2: VENCEDOR OU DUPLA CHANCE
    else {
        cor = "#ffcc00"; // Amarelo para indicações de resultado
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
            veredito = "JOGO EQUILIBRADO (SEM TENDÊNCIA)";
            chance = pEmpate;
            cor = "#ff4d4d"; // Vermelho
        }
    }

    // EXIBIÇÃO NO HTML
    const output = document.getElementById('output');
    output.style.display = "block";
    const resVeredito = document.getElementById('resultadoVeredito');
    resVeredito.innerText = veredito;
    resVeredito.style.color = cor;
    document.getElementById('probabilidadeFinal').innerText = chance.toFixed(2) + "%";
}






