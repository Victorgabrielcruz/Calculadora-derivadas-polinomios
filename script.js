// 1. Declaração de uma variável global para armazenar polinômios registrados
let polinomiosRegistrados = [];

// 2. Função para converter uma string de polinômio em um array de termos
function parsePolinomio(polinomio) {
  const termos = polinomio.match(/([+-]?\s*\d*x(?:\^\d+|²)?|[+-]?\s*\d*x|[+-]?\s*\d+)/g);

  return termos.map(termo => {
    const match = termo.match(/([+-]?\s*\d*)x(?:\^(\d+)|²)?/);

    let coeficiente, expoente;

    if (match) {
      coeficiente = match[1].replace(/\s/g, '') || '1';
      if (coeficiente === '+' || coeficiente === '-') {
        coeficiente += '1';
      }
      expoente = match[2] ? match[2].replace(/\s/g, '') : '2';
    } else {
      coeficiente = termo.replace(/\s/g, '');
      expoente = '0';
    }

    return {
      coeficiente: parseFloat(coeficiente),
      expoente: parseInt(expoente)
    };
  });
}

// 3. Função para calcular a derivada de um array de termos
function derivada(termos) {
  return termos.map(termo => {
    if (termo.expoente === 0) return null;
    let coeficiente = termo.coeficiente;
    let expoente = termo.expoente;
    coeficiente = coeficiente * expoente;
    expoente = expoente - 1;

    return { coeficiente: coeficiente, expoente: expoente };
  }).filter(termo => termo !== null);
}

// 4. Função para converter um array de termos em uma string de polinômio
function stringificarPolinomio(termos) {
  return termos.map(termo => {
    const coeficienteString = termo.coeficiente === 1 ? '' : termo.coeficiente === -1 ? '-' : termo.coeficiente;
    if (termo.expoente === 0) return coeficienteString;
    if (termo.expoente === 1) return coeficienteString + 'x';
    return coeficienteString + 'x^' + termo.expoente;
  }).join(' ').replace(/\s+/g, ' ').trim();
}

// 5. Função para calcular o valor funcional de um polinômio em um ponto
function calcularValorFuncional(termos, a) {
  return termos.reduce((soma, termo) => soma + termo.coeficiente * Math.pow(a, termo.expoente), 0);
}

// 6. Função para processar a entrada do polinômio, calcular a derivada e exibir os resultados
function calcular() {
  const polinomio = document.getElementById('polinomio').value;
  const polinomioParseado = parsePolinomio(polinomio);
  const polinomioDerivado = derivada(polinomioParseado);

  const f_x = `f(x) = ${polinomio}`;
  const f_linha_x = `f'(x) = ${stringificarPolinomio(polinomioDerivado)}`;

  const output = document.getElementById('output');
  output.innerHTML = `
    <section>
      <h3>Função Original</h3>
      <p>${f_x}</p>
    </section>
    <section>
      <h3>Derivada da Função</h3>
      <p>${f_linha_x}</p>
    </section>
  `;
  polinomiosRegistrados.push(polinomio);
  atualizarSelectPolinomios();
  $('#modalValorFuncional').modal('show'); // Usando jQuery

}

// 7. Função para calcular e exibir o valor funcional e a derivada em um ponto
function calcularValorFuncionalEExibir() {
  const a = parseFloat(document.getElementById('valorA').value);
  const polinomio = document.getElementById('polinomio').value;
  const polinomioParseado = parsePolinomio(polinomio);
  const polinomioDerivado = derivada(polinomioParseado);

  const f_a = calcularValorFuncional(polinomioParseado, a);
  const f_linha_a = calcularValorFuncional(polinomioDerivado, a);
  const ponto = `P(${a}, ${f_a})`;

  const output = document.getElementById('output');
  output.innerHTML += `
    <section>
      <h3>Valor Funcional e Derivada no Ponto</h3>
      <p>f(${a}) = ${f_a}</p>
      <p>f'(${a}) = ${f_linha_a}</p>
      <p>${ponto}</p>
    </section>
  `;

  $('#modalValorFuncional').modal('hide');
  $('#modalEquacaoTangente').modal('show');
}

// 8. Função para calcular e exibir a equação da reta tangente
function calcularEquacaoTangenteEExibir() {
  const a = parseFloat(document.getElementById('valorTangenteA').value);
  const polinomio = document.getElementById('polinomio').value;
  const polinomioParseado = parsePolinomio(polinomio);
  const polinomioDerivado = derivada(polinomioParseado);

  const f_tangente = calcularValorFuncional(polinomioParseado, a);
  const f_linha_tangente = calcularValorFuncional(polinomioDerivado, a);

  const equacaoTangenteSimplificada = simplificarEquacaoTangente(f_linha_tangente, a, f_tangente);

  const output = document.getElementById('output');
  output.innerHTML += `
    <section>
      <h3>Equação da Reta Tangente</h3>
      <p>A equação da reta tangente ao gráfico de f no ponto P(${a}, ${f_tangente}) é ${equacaoTangenteSimplificada}</p>
    </section>
  `;

  $('#modalEquacaoTangente').modal('hide');

  plotarGrafico(polinomioParseado, polinomioDerivado, { a: a, f_a: f_tangente, f_linha_a: f_linha_tangente });
}

// 9. Função para simplificar a equação da reta tangente
function simplificarEquacaoTangente(inclinacao, a, intercepcao) {
  const b = intercepcao - inclinacao * a;
  if (inclinacao === 1) {
    if (b < 0) {
      return `y = x ${b}`;
    } else if (b > 0) {
      return `y = x + ${b}`;
    }
  } else if (inclinacao === -1) {
    if (b < 0) {
      return `y = -x ${b}`;
    } else if (b > 0) {
      return `y = -x + ${b}`;
    }
  } else {
    if (b < 0) {
      return `y = ${inclinacao}x ${b}`;
    } else if (b > 0) {
      return `y = ${inclinacao}x + ${b}`;
    }
  }
}

// Variável global para armazenar a referência ao gráfico
// Variável global para armazenar a referência ao gráfico
let chartInstance;

// 10. Função para plotar o gráfico do polinômio, sua derivada e a reta tangente
function plotarGrafico(polinomio, derivada, pontoTangente) {
  const ctx = document.getElementById('graphCanvas').getContext('2d');
  
  // Verifica se já existe um gráfico e o destrói
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Calcular apenas os valores necessários para os limites do gráfico
  //const limites = [-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50];
  const valoresOriginal = limites.map(x => calcularValorFuncional(polinomio, x));
  const valoresDerivada = limites.map(x => calcularValorFuncional(derivada, x));
  const valoresTangente = limites.map(x => pontoTangente.f_linha_a * (x - pontoTangente.a) + pontoTangente.f_a);

  // Criação do gráfico
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: limites,
      datasets: [
        {
          label: 'Polinômio Original',
          data: valoresOriginal,
          borderColor: 'blue',
          fill: false
        },
        {
          label: 'Derivada',
          data: valoresDerivada,
          borderColor: 'green',
          fill: false
        },
        {
          label: 'Reta Tangente',
          data: valoresTangente,
          borderColor: 'red',
          fill: false
        }
      ]
    },
    options: {
      responsive: false, // Altere para false
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: 'x'
          }
        },
        y: {
          title: {
            display: true,
            text: 'y'
          }
        }
      }
    }
  });
}


// 11. Função para atualizar o campo de seleção com os polinômios registrados
function atualizarSelectPolinomios() {
  const selectPolinomios = document.getElementById('selectPolinomios');
  selectPolinomios.innerHTML = '';
  polinomiosRegistrados.forEach(polinomio => {
    const option = document.createElement('option');
    option.value = polinomio;
    option.text = polinomio;
    selectPolinomios.appendChild(option);
  });
}


// 12. Função para carregar o polinômio selecionado no campo de entrada
function carregarPolinomioSelecionado() {
  const selectPolinomios = document.getElementById('polinomiosRegistrados');
  const polinomioSelecionado = polinomiosRegistrados[selectPolinomios.value];
  document.getElementById('polinomio').value = polinomioSelecionado;
}

document.getElementById('calcular').addEventListener('click', calcular);
document.getElementById('calcularValorFuncional').addEventListener('click', calcularValorFuncionalEExibir);
document.getElementById('calcularEquacaoTangente').addEventListener('click', calcularEquacaoTangenteEExibir);
document.getElementById('carregarPolinomio').addEventListener('click', carregarPolinomioSelecionado);
