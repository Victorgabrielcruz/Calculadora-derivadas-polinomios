function parsePolynomial(poly) {
  const terms = poly.match(
      /([+-]?\d*\.?\d*x\^?-?\d*)|([+-]?\d*\.?\d*x)|([+-]?\d*\.?\d+)/g
  );
  return terms.map((term) => {
      let coef = 1,
          exp = 0;
      if (term.includes("x")) {
          const parts = term.split("x");
          coef =
              parts[0] === "" || parts[0] === "+"
                  ? 1
                  : parts[0] === "-"
                      ? -1
                      : parseFloat(parts[0]);
          exp = parts[1] ? parseFloat(parts[1].replace("^", "")) : 1;
      } else {
          coef = parseFloat(term);
      }
      return { coef, exp };
  });
}

function formatTerm({ coef, exp }) {
  if (coef === 0) return "";
  if (exp === 0) return `${coef}`;
  if (exp === 1) return `${coef === 1 ? "" : coef === -1 ? "-" : coef}x`;
  return `${coef === 1 ? "" : coef === -1 ? "-" : coef}x^${exp}`;
}

function evaluatePolynomial(parsedPoly, x) {
  return parsedPoly.reduce((acc, { coef, exp }) => acc + coef * Math.pow(x, exp), 0);
}

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
  document.getElementById("result").innerHTML = resultHtml;
  atualizaSelect();
  clearGraph();
}

function calculateFunctionalValue() {
  const a = parseFloat(document.getElementById("valueA").value);
  const poly = document.getElementById("polynomial").value;
  const parsedPoly = parsePolynomial(poly);

  const fA = parsedPoly.reduce(
      (acc, { coef, exp }) => acc + coef * Math.pow(a, exp),
      0
  );

  let derivative = parsedPoly
      .map(({ coef, exp }) => ({
          coef: coef * exp,
          exp: exp - 1,
      }))
      .filter(({ coef, exp }) => coef !== 0);

  const fPrimeA = derivative.reduce(
      (acc, { coef, exp }) => acc + coef * Math.pow(a, exp),
      0
  );

  const pointP = `P(${a}, ${fA})`;

  let resultHtml = `<p>f(${a}) = ${fA}</p>`;
  resultHtml += `<p>f'(${a}) = ${fPrimeA}</p>`;
  resultHtml += `<p>${pointP}</p>`;
  resultHtml += `<div>
                        <label for="tangentA">Deseja calcular equação da reta tangente ao gráfico de f no ponto ${pointP}? Se sim, qual o valor de a?</label>
                        <input type="number" id="tangentA" class="form-control">
                        <button class="btn btn-primary mt-2" onclick="calculateTangentEquation()">Calcular Equação da Reta Tangente</button>
                    </div>`;
  document.getElementById("functionalValueResult").innerHTML = resultHtml;
  plotGraph(parsedPoly, derivative);
}

function calculateTangentEquation() {
  const a = parseFloat(document.getElementById("tangentA").value);
  const poly = document.getElementById("polynomial").value;
  const parsedPoly = parsePolynomial(poly);

  const fA = parsedPoly.reduce(
      (acc, { coef, exp }) => acc + coef * Math.pow(a, exp),
      0
  );

  let derivative = parsedPoly
      .map(({ coef, exp }) => ({
          coef: coef * exp,
          exp: exp - 1,
      }))
      .filter(({ coef, exp }) => coef !== 0);

  const fPrimeA = derivative.reduce(
      (acc, { coef, exp }) => acc + coef * Math.pow(a, exp),
      0
  );

  // Construir a equação da reta tangente
  const tangentEquation = [
      { coef: fPrimeA, exp: 1 },
      { coef: fA - fPrimeA * a, exp: 0 }
  ];

  const formattedTangentEquation = tangentEquation
      .map(formatTerm)
      .filter(term => term)
      .join(" + ")
      .replace(/\+\s*-/g, "- ");

  let resultHtml = `<p>A equação da reta tangente ao gráfico de f no ponto P(${a}, ${fA}) é:</p>`;
  resultHtml += `<p>y=${formattedTangentEquation}</p>`;
  document.getElementById("tangentQuestion").innerHTML = resultHtml;
  plotGraphWithTangent(parsedPoly, derivative, fPrimeA, a, fA);
}

const selectElement = document.getElementById("options");

selectElement.addEventListener("change", (event) => {
  const selectedValue = event.target.value;
  document.getElementById("polynomial").value = selectedValue;
  document.getElementById("result").innerHTML = ``;
  clearGraph();
});

function atualizaSelect() {
  const select = document.getElementById("options");
  const poly = document.getElementById("polynomial").value;
  select.innerHTML += `<option value="${poly}">${poly}</option>`;
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
                  label: "f(x)",
                  data: polyData,
                  borderColor: "blue",
                  fill: false,
              },
              {
                  label: "f'(x)",
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
          },
      },
  });
}

function plotGraphWithTangent(parsedPoly, derivative, fPrimeA, a, fA) {
  const ctx = document.getElementById("chartCanvas").getContext("2d");
  const labels = Array.from({ length: 101 }, (_, i) => i - 50);

  const polyFunc = (x) =>
      parsedPoly.reduce((acc, { coef, exp }) => acc + coef * Math.pow(x, exp), 0);
  const derivativeFunc = (x) =>
      derivative.reduce((acc, { coef, exp }) => acc + coef * Math.pow(x, exp), 0);

  const polyData = labels.map((x) => polyFunc(x));
  const derivativeData = labels.map((x) => derivativeFunc(x));
  const tangentData = labels.map((x) => fPrimeA * x + (fA - fPrimeA * a));

  if (window.myChart) {
      window.myChart.destroy();
  }

  window.myChart = new Chart(ctx, {
      type: "line",
      data: {
          labels: labels,
          datasets: [
              {
                  label: "f(x)",
                  data: polyData,
                  borderColor: "blue",
                  fill: false,
              },
              {
                  label: "f'(x)",
                  data: derivativeData,
                  borderColor: "red",
                  fill: false,
              },
              {
                  label: "Tangente",
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
          },
      },
  });
}

function clearGraph() {
  if (window.myChart) {
      window.myChart.destroy();
  }
}

// Função para encontrar raízes de polinômios de qualquer grau entre -10 e 10
function findRoots() {
  document.getElementById('rootResult').innerHTML = "";
  const poly = document.getElementById("polynomial").value;
  const parsedPoly = parsePolynomial(poly);
  const derivative = parsedPoly
      .map(({ coef, exp }) => ({ coef: coef * exp, exp: exp - 1 }))
      .filter(({ coef, exp }) => coef !== 0);

  // Fase I - Isolamento dos intervalos que contêm as raízes
  const step = 0.1;
  const range = 20; // [-10, 10]
  let intervals = [];

  for (let i = -range; i < range; i += step) {
      const x1 = i;
      const x2 = i + step;
      const f1 = evaluatePolynomial(parsedPoly, x1);
      const f2 = evaluatePolynomial(parsedPoly, x2);

      if (f1 * f2 < 0) {
          intervals.push([x1, x2]);
      }
  }

  // Fase II - Refinamento da raiz usando o Método de Newton
  const tolerance = 1e-8;
  const maxIterations = 100;
  let roots = [];

  for (let [x1, x2] of intervals) {
      let x = (x1 + x2) / 2;
      let iterations = 0;
      while (iterations < maxIterations) {
          const fx = evaluatePolynomial(parsedPoly, x);
          const fpx = evaluatePolynomial(derivative, x);
          const xNext = x - fx / fpx;

          if (Math.abs(xNext - x) < tolerance) {
              roots.push(parseFloat(xNext.toFixed(8)));
              break;
          }

          x = xNext;
          iterations++;
      }
  }

  // Remover raízes duplicadas
  roots = [...new Set(roots)];

  let resultHtml = `<p>Raízes encontradas:</p>`;
  resultHtml += `<ul>${roots.map((root) => `<li>${root}</li>`).join("")}</ul>`;
  document.getElementById("rootResult").innerHTML = resultHtml;
}
