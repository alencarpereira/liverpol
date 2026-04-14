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
    const gpC = parseFloat(document.getElementById('gpCasa').value);
    const gsC = parseFloat(document.getElementById('gsCasa').value);
    const gpF = parseFloat(document.getElementById('gpFora').value);
    const gsF = parseFloat(document.getElementById('gsFora').value);

    if (isNaN(gpC) || isNaN(gsC) || isNaN(gpF) || isNaN(gsF)) {
        alert("Preencha as médias."); return;
    }

    const lambdaC = (gpC * gsF) / mediaLiga;
    const lambdaF = (gpF * gsC) / mediaLiga;

    // 1. Probabilidades de Gols
    const btts = (1 - poisson(0, lambdaC)) * (1 - poisson(0, lambdaF)) * 100;
    let under25 = 0;
    for (let i = 0; i <= 2; i++) {
        for (let j = 0; j <= 2; j++) {
            if (i + j < 3) under25 += poisson(i, lambdaC) * poisson(j, lambdaF);
        }
    }
    const over25 = (1 - under25) * 100;

    // 2. Probabilidades de Resultado (Vencedor)
    let pVitCasa = 0, pEmpate = 0, pVitFora = 0;
    for (let i = 0; i <= 6; i++) {
        for (let j = 0; j <= 6; j++) {
            let pPlacar = poisson(i, lambdaC) * poisson(j, lambdaF);
            if (i > j) pVitCasa += pPlacar;
            else if (i === j) pEmpate += pPlacar;
            else pVitFora += pPlacar;
        }
    }
    pVitCasa *= 100; pEmpate *= 100; pVitFora *= 100;

    // --- LÓGICA DE DECISÃO ---
    let veredito = "", chance = 0, cor = "#00d4ff";

    // Tenta primeiro os mercados de Gols (Over ou Ambos)
    if (over25 >= btts && over25 >= 50) {
        veredito = "OVER 2.5 GOLS";
        chance = over25;
    } else if (btts >= 50) {
        veredito = "AMBOS MARCAM";
        chance = btts;
        cor = "#4ecca3";
    }
    // Se gols forem arriscados (< 50%), busca Favorito ou Dupla Chance
    else {
        cor = "#ffcc00"; // Amarelo para sinal alternativo
        if (pVitCasa >= 50) {
            veredito = "VENCEDOR: CASA";
            chance = pVitCasa;
        } else if (pVitFora >= 50) {
            veredito = "VENCEDOR: FORA";
            chance = pVitFora;
        } else if (pVitCasa + pEmpate >= 70) {
            veredito = "DUPLA CHANCE: CASA OU EMPATE";
            chance = pVitCasa + pEmpate;
        } else if (pVitFora + pEmpate >= 70) {
            veredito = "DUPLA CHANCE: FORA OU EMPATE";
            chance = pVitFora + pEmpate;
        } else {
            veredito = "JOGO MUITO EQUILIBRADO";
            chance = pEmpate;
            cor = "#ff4d4d";
        }
    }

    // Exibição
    document.getElementById('output').style.display = "block";
    const resVeredito = document.getElementById('resultadoVeredito');
    resVeredito.innerText = veredito;
    resVeredito.style.color = cor;
    document.getElementById('probabilidadeFinal').innerText = chance.toFixed(2) + "%";
}





