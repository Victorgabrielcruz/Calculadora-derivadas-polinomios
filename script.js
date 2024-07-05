// Função para analisar o polinômio a partir de uma string
function parsePolynomial(poly) {
    const terms = poly.match(/([+-]?\d*\.?\d*x\^?-?\d*)|([+-]?\d*\.?\d*x)|([+-]?\d*\.?\d+)/g);
    return terms.map(term => {
        let coef = 1, exp = 0;
        if (term.includes('x')) {
            const parts = term.split('x');
            coef = parts[0] === '' || parts[0] === '+' ? 1 : (parts[0] === '-' ? -1 : parseFloat(parts[0]));
            exp = parts[1] ? parseFloat(parts[1].replace('^', '')) : 1;
        } else {
            coef = parseFloat(term);
        }
        return { coef, exp };
    });
}

function calcularRaiz() {
    const n = parseFloat(document.getElementById('inputN').value);
    const k = parseFloat(document.getElementById('inputK').value);

    if (isNaN(n) || isNaN(k)) {
        document.getElementById('nthRootResult').innerHTML = '<p>Por favor, insira valores válidos para n e k.</p>';
        return;
    }

    const root = Math.pow(k, 1 / n);
    console.log(n);
    switch(n) {
        case 1:
            document.getElementById('nthRootResult').innerHTML = `<p>A raiz primeira de ${k} é ${root}.</p>`;
            break;
        case 2:
            document.getElementById('nthRootResult').innerHTML = `<p>A raiz quadrada de ${k} é ${root}.</p>`;
            break;
        case 3:
            document.getElementById('nthRootResult').innerHTML = `<p>A raiz cubica de ${k} é ${root}.</p>`;
            break;
        case 4:
            document.getElementById('nthRootResult').innerHTML = `<p>A raiz quarta de ${k} é ${root}.</p>`;
            break;
        case 5:
            document.getElementById('nthRootResult').innerHTML = `<p>A raiz quinta de ${k} é ${root}.</p>`;
            break;
        case 6:
            document.getElementById('nthRootResult').innerHTML = `<p>A raiz sexta de ${k} é ${root}.</p>`;
            break;
        case 7:
            document.getElementById('nthRootResult').innerHTML = `<p>A raiz setima de ${k} é ${root}.</p>`;
            break;
        case 8:
            document.getElementById('nthRootResult').innerHTML = `<p>A raiz oitava de ${k} é ${root}.</p>`;
            break;
        case 9:
            document.getElementById('nthRootResult').innerHTML = `<p>A raiz nona de ${k} é ${root}.</p>`;
            break;
        case 10:
            document.getElementById('nthRootResult').innerHTML = `<p>A raiz decima de ${k} é ${root}.</p>`;
            break;
        default:
            document.getElementById('nthRootResult').innerHTML = `<p>A raiz ${n}-ésima de ${k} é ${root}.</p>`;
    }
}


// Função para formatar termos do polinômio
function formatTerm({ coef, exp }) {
    if (coef === 0) return '';
    if (exp === 0) return `${coef}`;
    if (exp === 1) return `${coef === 1 ? '' : (coef === -1 ? '-' : coef)}x`;
    return `${coef === 1 ? '' : (coef === -1 ? '-' : coef)}x^${exp}`;
}

// Função para calcular a derivada do polinômio
function calculateDerivative() {
    const poly = document.getElementById("polynomial").value;
    const parsedPoly = parsePolynomial(poly);
  
    // Verificação se a função é constante
    const isConstant = parsedPoly.every((term) => term.exp === 0);
    if (isConstant) {
      const originalPoly = parsedPoly
        .map(formatTerm)
        .join(" + ")
        .replace(/\+\s*-/g, "- ");
      document.getElementById(
        "result"
      ).innerHTML = `
      <p>f(x) = ${originalPoly}</p><p>f'(x) = 0</p>
      <div>
          <label for="valueA">Deseja calcular valor funcional? Se sim, qual o valor de a?</label>
          <input type="number" id="valueA" class="form-control">
          <button class="btn btn-primary mt-2" onclick="calculateFunctionalValue()">Calcular f(a)</button>
      </div>
      <div id="functionalValueResult"></div>
      <div id="tangentQuestion" class="mt-4"></div>
    <button class="btn btn-primary mt-4" onclick="calculateRoots()">Calcular Raízes</button>;

      `;
      atualizaSelect();
      clearGraph();
      return;
    }
  
    let derivative = parsedPoly
      .map(({ coef, exp }) => ({
        coef: coef * exp,
        exp: exp - 1,
      }))
      .filter(({ coef, exp }) => coef !== 0);
  
    const originalPoly = parsedPoly
      .map(formatTerm)
      .filter((term) => term)
      .join(" + ")
      .replace(/\+\s*-/g, "- ");
    const derivativePoly = derivative
      .map(formatTerm)
      .filter((term) => term)
      .join(" + ")
      .replace(/\+\s*-/g, "- ");
  
    let resultHtml = `<p>f(x) = ${originalPoly}</p>`;
    resultHtml += `<p>f'(x) = ${derivativePoly}</p>`;
    resultHtml += `<div>
                          <label for="valueA">Deseja calcular valor funcional? Se sim, qual o valor de a?</label>
                          <input type="number" id="valueA" class="form-control">
                          <button class="btn btn-primary mt-2" onclick="calculateFunctionalValue()">Calcular f(a)</button>
                      </div>`;
    resultHtml += `<div id="functionalValueResult"></div>`;
    resultHtml += `<div id="tangentQuestion" class="mt-4"></div>`;
    resultHtml += `<button class="btn btn-primary mt-4" onclick="calculateRoots()">Calcular Raízes</button>`;
    document.getElementById("result").innerHTML = resultHtml;
    atualizaSelect();
    clearGraph();
  }

// Função para calcular o valor funcional de f(a)
function calculateFunctionalValue() {
    const a = parseFloat(document.getElementById('valueA').value);
    const poly = document.getElementById('polynomial').value;
    const parsedPoly = parsePolynomial(poly);

    const fA = parsedPoly.reduce((acc, { coef, exp }) => acc + coef * Math.pow(a, exp), 0);

    let derivative = parsedPoly.map(({ coef, exp }) => ({
        coef: coef * exp,
        exp: exp - 1
    })).filter(({ coef, exp }) => coef !== 0 && exp >= 0);

    const fPrimeA = derivative.reduce((acc, { coef, exp }) => acc + coef * Math.pow(a, exp), 0);

    const pointP = `P(${a}, ${fA})`;

    let resultHtml = `<p>f(${a}) = ${fA}</p>`;
    resultHtml += `<p>f'(${a}) = ${fPrimeA}</p>`;
    resultHtml += `<p>${pointP}</p>`;
    resultHtml += `<div>
                      <label for="tangentA">Deseja calcular equação da reta tangente ao gráfico de f no ponto ${pointP}? Se sim, qual o valor de a?</label>
                      <input type="number" id="tangentA" class="form-control">
                      <button class="btn btn-primary mt-2" onclick="calculateTangentEquation()">Calcular Equação da Reta Tangente</button>
                   </div>`;
    document.getElementById('functionalValueResult').innerHTML = resultHtml;
    plotGraph(parsedPoly, derivative);
}

// Função para calcular a equação da reta tangente ao gráfico
function calculateTangentEquation() {
    const a = parseFloat(document.getElementById('tangentA').value);
    const poly = document.getElementById('polynomial').value;
    const parsedPoly = parsePolynomial(poly);

    const fA = parsedPoly.reduce((acc, { coef, exp }) => acc + coef * Math.pow(a, exp), 0);

    let derivative = parsedPoly.map(({ coef, exp }) => ({
        coef: coef * exp,
        exp: exp - 1
    })).filter(({ coef, exp }) => coef !== 0 && exp >= 0);

    const fPrimeA = derivative.reduce((acc, { coef, exp }) => acc + coef * Math.pow(a, exp), 0);

    const yIntercept = fA - fPrimeA * a;

    let tangentEquation = `y = ${fPrimeA}x`;
    if (yIntercept !== 0) {
        tangentEquation += ` ${yIntercept < 0 ? '-' : '+'} ${Math.abs(yIntercept)}`;
    }

    let resultHtml = `<p>A equação da reta tangente ao gráfico de f no ponto P(${a}, ${fA}) é:</p>`;
    resultHtml += `<p>${tangentEquation}</p>`;
    document.getElementById('tangentQuestion').innerHTML = resultHtml;
    plotGraphWithTangent(parsedPoly, derivative, fPrimeA, a, fA);
}

// Função para atualizar o select com o polinômio atual
function atualizaSelect() {
    const select = document.getElementById('options');
    const poly = document.getElementById('polynomial').value;
    select.innerHTML += `<option value="${poly}">${poly}</option>`;
}

// Função para limpar o gráfico
function clearGraph() {
    if (window.myChart) {
        window.myChart.destroy();
    }
}

function plotGraph(parsedPoly, derivative) {
    const ctx = document.getElementById("chartCanvas").getContext("2d");
    const labels = Array.from({ length: 101 }, (_, i) => i - 50);

    const polyFunc = (x) =>
        parsedPoly.reduce((acc, { coef, exp }) => acc + coef * Math.pow(x, exp), 0);
    const derivativeFunc = (x) =>
        derivative.reduce((acc, { coef, exp }) => acc + coef * Math.pow(x, exp), 0);

    const polyData = labels.map((x) => polyFunc(x));
    const derivativeData = labels.map((x) => derivativeFunc(x));

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Função Original",
                    data: polyData,
                    borderColor: "blue",
                    fill: false,
                },
                {
                    label: "Derivada",
                    data: derivativeData,
                    borderColor: "red",
                    fill: false,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: "linear",
                    position: "bottom",
                },
                y: {
                    min: -100,
                    max: 100,
                },
            },
        },
    });
}


// Função para plotar o gráfico com a reta tangente
function plotGraphWithTangent(parsedPoly, derivative, fPrimeA, a, fA) {
    const ctx = document.getElementById("chartCanvas").getContext("2d");
    const labels = Array.from({ length: 101 }, (_, i) => i - 50);

    const polyFunc = (x) =>
        parsedPoly.reduce((acc, { coef, exp }) => acc + coef * Math.pow(x, exp), 0);
    const derivativeFunc = (x) =>
        derivative.reduce((acc, { coef, exp }) => acc + coef * Math.pow(x, exp), 0);
    const tangentFunc = (x) => fPrimeA * x + (fA - fPrimeA * a);

    const polyData = labels.map((x) => polyFunc(x));
    const derivativeData = labels.map((x) => derivativeFunc(x));
    const tangentData = labels.map((x) => tangentFunc(x));

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Função Original",
                    data: polyData,
                    borderColor: "blue",
                    fill: false,
                },
                {
                    label: "Derivada",
                    data: derivativeData,
                    borderColor: "red",
                    fill: false,
                },
                {
                    label: "Reta Tangente",
                    data: tangentData,
                    borderColor: "green",
                    fill: false,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: "linear",
                    position: "bottom",
                },
                y: {
                    min: -100,
                    max: 100,
                },
            },
        },
    });
}
// Função para encontrar intervalos onde as raízes podem estar localizadas
function findRoots(parsedPoly) {
    const roots = [];
    for (let i = -100; i < 100; i += 1) {
        const x1 = i / 10;
        const x2 = (i + 1) / 10;
        const f1 = parsedPoly.reduce((acc, { coef, exp }) => acc + coef * Math.pow(x1, exp), 0);
        const f2 = parsedPoly.reduce((acc, { coef, exp }) => acc + coef * Math.pow(x2, exp), 0);
        if (f1 * f2 <= 0) {
            roots.push({ x1, x2 });
        }
    }
    return roots;
}

// Função do método de Newton-Raphson para encontrar raízes precisas
function newtonRaphson(parsedPoly, derivative, interval, tolerance = 1e-8, maxIter = 1000) {
    const [x1, x2] = [interval.x1, interval.x2];
    let x0 = (x1 + x2) / 2;
    let fx = parsedPoly.reduce((acc, { coef, exp }) => acc + coef * Math.pow(x0, exp), 0);
    let dfx = derivative.reduce((acc, { coef, exp }) => acc + coef * Math.pow(x0, exp), 0);

    let iter = 0;
    while (Math.abs(fx) > tolerance && iter < maxIter) {
        if (dfx === 0) {
            break;
        }
        x0 = x0 - fx / dfx;
        fx = parsedPoly.reduce((acc, { coef, exp }) => acc + coef * Math.pow(x0, exp), 0);
        dfx = derivative.reduce((acc, { coef, exp }) => acc + coef * Math.pow(x0, exp), 0);
        iter++;
    }
    return Math.abs(fx) <= tolerance ? x0 : null;
}

// Função para calcular as raízes do polinômio
function calculateRoots() {
    const poly = document.getElementById('polynomial').value;
    const parsedPoly = parsePolynomial(poly);

    const derivative = parsedPoly.map(({ coef, exp }) => ({
        coef: coef * exp,
        exp: exp - 1
    })).filter(({ coef, exp }) => coef !== 0);

    const intervals = findRoots(parsedPoly);
    const roots = intervals.map(interval => newtonRaphson(parsedPoly, derivative, interval)).filter(root => root !== null);

    let resultHtml = `<p>Fase 1: o número de possíveis raízes são: ${intervals.length}</p>`;
    resultHtml += `<p>Fase 2: as raízes do polinômio fornecido no intervalo [-10, 10] são: ${roots.join(', ')}</p>`;

    document.getElementById('rootResult').innerHTML = resultHtml;
    let canvasId = "chartCanvas_Raizes";
    plotGraphWithRoots(canvasId, parsedPoly, roots, derivative);    
}

// Função para plotar o gráfico com as raízes do polinômio
function plotGraphWithRoots(canvasId, parsedPoly, roots, derivative) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`Elemento canvas com ID ${canvasId} não encontrado.`);
        return;
    }

    const ctx = canvas.getContext('2d');
    const labels = Array.from({ length: 101 }, (_, i) => i - 50);
    const derivativeFunc = x => derivative.reduce((acc, { coef, exp }) => acc + coef * Math.pow(x, exp), 0);

    const polyFunc = (x) =>
        parsedPoly.reduce((acc, { coef, exp }) => acc + coef * Math.pow(x, exp), 0);
    const derivativeData = labels.map(x => derivativeFunc(x));
    const polyData = labels.map((x) => polyFunc(x));
    const rootData = roots.map((root) => ({ x: root, y: 0 }));

    // Destruir o gráfico existente se houver
    if (canvas.myChart) {
        canvas.myChart.destroy();
    }

    canvas.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Função Original',
                    data: polyData,
                    borderColor: 'blue',
                    fill: false,
                },
                {
                    label: 'Raízes',
                    data: rootData,
                    borderColor: 'green',
                    fill: false,
                    showLine: false,
                    pointRadius: 5,
                    pointBackgroundColor: 'red',
                },
                {
                    label: "Derivada",
                    data: derivativeData,
                    borderColor: "purple",
                    fill: false,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                },
                y: {
                    min: -100,
                    max: 100,
                },
            },
        },
    });
}

// Evento para atualizar o polinômio selecionado
const selectElement = document.getElementById('options');
selectElement.addEventListener('change', (event) => {
    const selectedValue = event.target.value;
    document.getElementById('polynomial').value = selectedValue;
    document.getElementById('result').innerHTML = ``;
    clearGraph();
});