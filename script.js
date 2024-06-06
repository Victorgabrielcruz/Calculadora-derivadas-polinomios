/*
 * Este script realiza várias operações matemáticas relacionadas a polinômios, incluindo derivadas, cálculo de valores funcionais,
 * e a exibição da equação da reta tangente. Abaixo está a ordem das operações e a função de cada parte do código:
 *
 * 1. Declarar uma variável global para armazenar polinômios registrados.
 * 2. Definir a função `parsePolinomio` para converter uma string de polinômio em um array de termos.
 * 3. Definir a função `derivada` para calcular a derivada de um array de termos.
 * 4. Definir a função `stringificarPolinomio` para converter um array de termos em uma string de polinômio.
 * 5. Definir a função `calcularValorFuncional` para calcular o valor funcional de um polinômio em um ponto.
 * 6. Definir a função `calcular` para processar a entrada do polinômio, calcular a derivada e exibir os resultados.
 * 7. Definir a função `calcularValorFuncionalEExibir` para calcular e exibir o valor funcional e a derivada em um ponto.
 * 8. Definir a função `calcularEquacaoTangenteEExibir` para calcular e exibir a equação da reta tangente.
 * 9. Definir a função `simplificarEquacaoTangente` para simplificar a equação da reta tangente.
 * 10. Definir a função `plotarGrafico` para plotar o gráfico do polinômio, sua derivada e a reta tangente.
 * 11. Definir a função `atualizarSelectPolinomios` para atualizar o select com polinômios registrados.
 * 12. Definir a função `selecionarPolinomioRegistrado` para preencher o campo de entrada com um polinômio registrado.
 */

// 1. Declaração de uma variável global para armazenar polinômios registrados
let polinomiosRegistrados = [];

// 2. Função para converter uma string de polinômio em um array de termos
function parsePolinomio(polinomio) {
    const termos = polinomio.match(/([+-]?\s*\d*x\^?\d*|[+-]?\s*\d*x|[+-]?\s*\d+)/g);
    return termos.map(termo => {
      const [_, coeficiente, expoente] = termo.match(/([+-]?\s*\d*)x\^?(\d*)/) || [termo, termo, '0'];
      return {
        coeficiente: coeficiente.replace(/\s/g, '') || (termo.includes('x') ? '1' : '0'),
        expoente: expoente.replace(/\s/g, '') || (termo.includes('x') ? '1' : '0')
      };
    });
  }  
  
// 3. Função para calcular a derivada de um array de termos
function derivada(termos) {
    return termos.map(termo => {
      if (termo.expoente === '0') return null;
      let coeficiente = parseFloat(termo.coeficiente);
      let expoente = parseFloat(termo.expoente);
  
      // Verifica se o expoente é -1 ou 1
      if (expoente === -1) {
        coeficiente = -1;
        expoente = 1;
      } else if (expoente === 1) {
        coeficiente = 1;
        expoente = 1;
      } else {
        coeficiente = coeficiente * expoente;
        expoente = expoente - 1;
      }
  
      return { coeficiente: coeficiente.toString(), expoente: expoente.toString() };
    }).filter(termo => termo !== null);
  }
  
  

// 4. Função para converter um array de termos em uma string de polinômio
function stringificarPolinomio(termos) {
  return termos.map(termo => {
    const coeficiente = termo.coeficiente === '1' ? '' : termo.coeficiente === '-1' ? '-' : termo.coeficiente;
    if (termo.expoente === '0') return coeficiente;
    if (termo.expoente === '1') return coeficiente + '1';
    return coeficiente + 'x^' + termo.expoente;
  }).join(' ').replace(/\s+/g, ' ').trim();
}

// 5. Função para calcular o valor funcional de um polinômio em um ponto
function calcularValorFuncional(termos, a) {
  return termos.reduce((soma, termo) => soma + parseFloat(termo.coeficiente) * Math.pow(a, parseFloat(termo.expoente)), 0);
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

  $('#modalValorFuncional').modal('show');
}

// 7. Função para calcular e exibir o valor funcional e a derivada em um ponto
function calcularValorFuncionalEExibir() {
  const a = document.getElementById('valorA').value;
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
function abrirModal(){
    $('#modalEquacaoTangente').modal('show');
}
function limparinput(){
    document.getElementById('polinomio').value = '';
    document.getElementById('valorA').value = '';
    document.getElementById('valorTangenteA').value = '';
}
// 8. Função para calcular e exibir a equação da reta tangente
function calcularEquacaoTangenteEExibir() {
  const a = document.getElementById('valorTangenteA').value;
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

  plotarGrafico(polinomioParseado, polinomioDerivado, { a: parseFloat(a), f_a: f_tangente, f_linha_a: f_linha_tangente });
  document.getElementById('polinomio').value = '';
  document.getElementById('valorA').value = '';
  document.getElementById('valorTangenteA').value = '';
}

// 9. Função para simplificar a equação da reta tangente
function simplificarEquacaoTangente(inclinacao, a, intercepcao) {
  const b = intercepcao - inclinacao * a;
  if (inclinacao == 1) {
    if (b < 0) {
      return `y = x ${b}`;
    } else if (b > 0) {
      return `y = x + ${b}`;
    }
  } else if (inclinacao == -1) {
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
let chartInstance;

// 10. Função para plotar o gráfico do polinômio, sua derivada e a reta tangente
function plotarGrafico(polinomio, derivada, pontoTangente) {
    const ctx = document.getElementById('graphCanvas').getContext('2d');

    // Verifica se já existe um gráfico e o destrói
    if (chartInstance) {
        chartInstance.destroy();
    }

    const pontos = Array.from({ length: 101 }, (_, i) => i - 50);
    const valoresOriginal = pontos.map(x => calcularValorFuncional(polinomio, x));
    const valoresDerivada = pontos.map(x => calcularValorFuncional(derivada, x));
    let datasets = [{
        label: 'f(x)',
        data: valoresOriginal,
        borderColor: 'blue',
        borderWidth: 1,
        fill: false
    }, {
        label: "f'(x)",
        data: valoresDerivada,
        borderColor: 'red',
        borderWidth: 1,
        fill: false
    }];

    if (pontoTangente) {
        const { a, f_a, f_linha_a } = pontoTangente;
        const valoresTangente = pontos.map(x => f_linha_a * (x - a) + f_a);
        datasets.push({
            label: 'Tangente',
            data: valoresTangente,
            borderColor: 'green',
            borderWidth: 1,
            fill: false
        });
    }

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: pontos,
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                }
            }
        }
    });
}



// 11. Função para atualizar o select com polinômios registrados
function atualizarSelectPolinomios() {
    let polinomios = document.getElementById('polinomio').value;
    let selectPolinomios = document.getElementById('polinomiosRegistrados');
    
    if (selectPolinomios) {
        // Verificar se já existe uma option com o mesmo valor
        let optionExistente = Array.from(selectPolinomios.options).find(option => option.value === polinomios);
        
        if (optionExistente) {
            console.log('Este polinômio já está registrado.');
        } else {
            selectPolinomios.innerHTML += `<option value="${polinomios}">${polinomios}</option>`;
        }
    } else {
        console.error('Elemento selectPolinomios não encontrado.');
    }
}


// 12. Função para preencher o campo de entrada com um polinômio registrado
function selecionarPolinomioRegistrado(element) { 
    const polinomio = element.value;
    document.getElementById('polinomio').value = polinomio;
    calcular();
}
