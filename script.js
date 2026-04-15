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
        alert("Preencha as médias."); return;
    }

    const lambdaA = (gpA * gsB) / mediaLiga;
    const lambdaB = (gpB * gsA) / mediaLiga;

    // --- CÁLCULO DE PROBABILIDADES DE GOLS ---
    const btts = (1 - poisson(0, lambdaA)) * (1 - poisson(0, lambdaB)) * 100;

    let probGols = {};
    for (let i = 0; i <= 6; i++) {
        for (let j = 0; j <= 6; j++) {
            let p = poisson(i, lambdaA) * poisson(j, lambdaB);
            let total = i + j;
            probGols[total] = (probGols[total] || 0) + p;
        }
    }

    const over15 = (1 - (probGols[0] + probGols[1])) * 100;
    const over25 = (over15 - (probGols[2] * 100));
    const under35 = (probGols[0] + probGols[1] + probGols[2] + probGols[3]) * 100;

    // --- CÁLCULO DE RESULTADO (A, B, Empate) ---
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

    // --- LÓGICA DE DECISÃO ---
    let veredito = "", chance = 0, cor = "";

    // 1. PRIORIDADE: OVER 2.5 OU AMBOS MARCAM (Mínimo 50%)
    if (over25 >= 50 || btts >= 50) {
        if (over25 >= btts) {
            veredito = "OVER 2.5 GOLS";
            chance = over25;
            cor = "#00d4ff"; // Azul
        } else {
            veredito = "AMBOS MARCAM";
            chance = btts;
            cor = "#4ecca3"; // Verde
        }
    }
    // 2. SE NÃO, APLICA O COMBO ESTRATÉGICO (DC + O1.5/U3.5)
    else {
        cor = "#ffcc00"; // Amarelo
        let dcTipo = (pVitA + pEmpate >= pVitB + pEmpate) ? "A OU EMPATE" : "B OU EMPATE";
        let dcProb = (dcTipo === "A OU EMPATE") ? (pVitA + pEmpate) : (pVitB + pEmpate);

        // Lógica de Diferença (Se Diferença >= 0.50 vai de Under 3.5, senão Over 1.5)
        let difGols = (under35 - over15) / 100;
        let comboGols = difGols >= 0.50 ? "UNDER 3.5" : "OVER 1.5";

        veredito = `${dcTipo} + ${comboGols}`;
        chance = dcProb;
    }

    // 3. EXIBIÇÃO
    document.getElementById('output').style.display = "block";
    const resV = document.getElementById('resultadoVeredito');
    resV.innerText = veredito;
    resV.style.color = cor;
    document.getElementById('probabilidadeFinal').innerText = chance.toFixed(2) + "%";
}








