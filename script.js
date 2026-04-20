function fatorial(n) {
    if (n === 0 || n === 1) return 1;
    let res = 1; for (let i = 2; i <= n; i++) res *= i;
    return res;
}

function poisson(k, lambda) {
    return (Math.exp(-lambda) * Math.pow(lambda, k)) / fatorial(k);
}

function calcular() {
    const lerInput = (id) => {
        const val = document.getElementById(id).value.replace(',', '.');
        return parseFloat(val);
    };

    // 1. Médias Básicas
    const mediaLigaGeral = parseFloat(document.getElementById('mediaLiga').value);
    const mediaPorTime = mediaLigaGeral / 2;

    const gpA = lerInput('gpCasa'); // Gols Pró Mandante
    const gsA = lerInput('gsCasa'); // Gols Sofridos Mandante
    const gpB = lerInput('gpFora'); // Gols Pró Visitante
    const gsB = lerInput('gsFora'); // Gols Sofridos Visitante

    if (isNaN(gpA) || isNaN(gsA) || isNaN(gpB) || isNaN(gsB)) {
        alert("Preencha todas as médias corretamente."); return;
    }

    // 2. APLICAÇÃO DO PESO DE MANDO DE CAMPO (Fator 1.10 Casa e 0.90 Visitante)
    const lambdaA = (gpA * gsB / mediaPorTime) * 1.10;
    const lambdaB = (gpB * gsA / mediaPorTime) * 0.90;

    // --- CÁLCULO DE PROBABILIDADES DE GOLS ---
    const btts = (1 - poisson(0, lambdaA)) * (1 - poisson(0, lambdaB)) * 100;

    let probGols = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    for (let i = 0; i <= 6; i++) {
        for (let j = 0; j <= 6; j++) {
            let p = poisson(i, lambdaA) * poisson(j, lambdaB);
            let total = i + j;
            if (total <= 6) probGols[total] += p;
        }
    }

    const over15 = (1 - (probGols[0] + probGols[1])) * 100;
    const over25 = (1 - (probGols[0] + probGols[1] + probGols[2])) * 100;
    const under35 = (probGols[0] + probGols[1] + probGols[2] + probGols[3]) * 100;

    // --- CÁLCULO DE RESULTADO (1, X, 2) ---
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

    // --- LÓGICA DE DECISÃO REFINADA (Sarrafo de 60%) ---
    let veredito = "", chance = 0, cor = "";

    // Prioridade 1: Over 2.5 ou BTTS (Agressivo)
    if (over25 >= 60 || btts >= 55) {
        // Se o BTTS for muito provável e o Over também, 
        // mas a probabilidade de um time golear sozinha for baixa, BTTS é mais seguro.
        if (btts >= 55 && btts > (over25 - 5)) {
            veredito = "AMBOS MARCAM";
            chance = btts;
            cor = "#4ecca3";
        } else {
            veredito = "OVER 2.5 GOLS";
            chance = over25;
            cor = "#00d4ff";
        }
    }

    // Prioridade 2: Combo Dupla Chance + Gols mais provável (Conservador)
    else {
        cor = "#ffcc00";

        // 1. Dupla Chance: Escolhe o lado com maior probabilidade de não perder
        let dcTipo = (pVitA + pEmpate >= pVitB + pEmpate) ? "1X" : "X2";
        let dcProb = (dcTipo === "1X") ? (pVitA + pEmpate) : (pVitB + pEmpate);

        // 2. Lógica de Gols: Prioridade para Over 1.5 com sarrafo de 65%
        let mercadoGols = "";
        let probGolsFinal = 0;

        if (over15 >= 65) {
            mercadoGols = "OVER 1.5";
            probGolsFinal = over15;
        } else {
            mercadoGols = "UNDER 3.5";
            probGolsFinal = under35;
        }

        // 3. Veredito final do Combo
        veredito = `${dcTipo} & ${mercadoGols}`;
        chance = (dcProb + probGolsFinal) / 2;
    }

    // --- EXIBIÇÃO ---
    document.getElementById('output').style.display = "block";
    const resV = document.getElementById('resultadoVeredito');
    const resP = document.getElementById('probabilidadeFinal');

    resV.innerText = veredito;
    resV.style.color = cor;
    resP.innerText = chance.toFixed(2) + "%";
    resP.style.color = cor;
}

function limparCampos() {
    // Limpa todos os inputs de número
    document.querySelectorAll('input[type="number"]').forEach(input => input.value = '');

    // Reseta o select para a primeira opção (ou a padrão)
    document.getElementById('mediaLiga').selectedIndex = 0;

    // Esconde a área de resultados
    document.getElementById('output').style.display = 'none';
}








