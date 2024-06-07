function parsePolynomial(poly) {
  const terms = poly.match(/([+-]?\d*\.?\d*x\^?\d*)|([+-]?\d*\.?\d*x)|([+-]?\d*\.?\d+)/g);
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

function formatTerm({ coef, exp }) {
  if (coef === 0) return '';
  if (exp === 0) return `${coef}`;
  if (exp === 1) return `${coef === 1 ? '' : (coef === -1 ? '-' : coef)}x`;
  return `${coef === 1 ? '' : (coef === -1 ? '-' : coef)}x^${exp}`;
}

function calculateDerivative() {
  const poly = document.getElementById('polynomial').value;
  const parsedPoly = parsePolynomial(poly);

  let derivative = parsedPoly.map(({ coef, exp }) => ({
      coef: coef * exp,
      exp: exp - 1
  })).filter(({ coef, exp }) => coef !== 0 && exp >= 0);

  const originalPoly = parsedPoly.map(formatTerm).filter(term => term).join(' + ').replace(/\+\s*-/g, '- ');
  const derivativePoly = derivative.map(formatTerm).filter(term => term).join(' + ').replace(/\+\s*-/g, '- ');

  let resultHtml = `<p>f(x) = ${originalPoly}</p>`;
  resultHtml += `<p>f'(x) = ${derivativePoly}</p>`;
  resultHtml += `<div>
                      <label for="valueA">Deseja calcular valor funcional? Se sim, qual o valor de a?</label>
                      <input type="number" id="valueA" class="form-control">
                      <button class="btn btn-primary mt-2" onclick="calculateFunctionalValue()">Calcular f(a)</button>
                 </div>`;
  resultHtml += `<div id="functionalValueResult"></div>`;
  resultHtml += `<div id="tangentQuestion" class="mt-4"></div>`;
  document.getElementById('result').innerHTML = resultHtml;
}

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
}

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

  const tangentEquation = `y = ${fPrimeA}x + (${fA - fPrimeA * a})`;

  let resultHtml = `<p>A equação da reta tangente ao gráfico de f no ponto P(${a}, ${fA}) é:</p>`;
  resultHtml += `<p>${tangentEquation}</p>`;
  document.getElementById('tangentQuestion').innerHTML = resultHtml;
}
