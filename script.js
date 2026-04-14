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
    const mediaLiga = parseFloat(document.getElementById('mediaLiga').value) / 2;
    const gpCasa = parseFloat(document.getElementById('gpCasa').value);
    const gsCasa = parseFloat(document.getElementById('gsCasa').value);
    const gpFora = parseFloat(document.getElementById('gpFora').value);
    const gsFora = parseFloat(document.getElementById('gsFora').value);

    if (isNaN(gpCasa) || isNaN(gsCasa) || isNaN(gpFora) || isNaN(gsFora)) {
        alert("Preencha as médias dos últimos 5 jogos.");
        return;
    }

    const lambdaCasa = (gpCasa * gsFora) / mediaLiga;
    const lambdaFora = (gpFora * gsCasa) / mediaLiga;

    // Probabilidade Ambos Marcam
    const btts = (1 - poisson(0, lambdaCasa)) * (1 - poisson(0, lambdaFora)) * 100;

    // Probabilidade Over 2.5
    let under25 = 0;
    for (let i = 0; i <= 2; i++) {
        for (let j = 0; j <= 2; j++) {
            if (i + j < 3) under25 += poisson(i, lambdaCasa) * poisson(j, lambdaFora);
        }
    }
    const over25 = (1 - under25) * 100;

    // Decisão do Cérebro
    let veredito = "";
    let chance = 0;
    let cor = "";

    if (over25 >= btts) {
        veredito = "OVER 2.5 GOLS";
        chance = over25;
        cor = "#00d4ff"; // Azul
    } else {
        veredito = "AMBOS MARCAM";
        chance = btts;
        cor = "#4ecca3"; // Verde
    }

    // Exibição
    const output = document.getElementById('output');
    output.style.display = "block";

    const resVeredito = document.getElementById('resultadoVeredito');
    resVeredito.innerText = veredito;
    resVeredito.style.color = cor;

    const resProb = document.getElementById('probabilidadeFinal');
    resProb.innerText = chance.toFixed(2) + "%";
    resProb.style.color = cor;
}



