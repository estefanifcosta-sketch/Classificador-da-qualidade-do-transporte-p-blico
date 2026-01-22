/**
 * Lógica de Álgebra Linear aplicada à Classificação de Transporte
 */

// 1. Definição do Vetor de Pesos (Métrica Ponderada)
// Atribuímos pesos maiores para Segurança (x6) e Pontualidade (x3)
const weights = [1.5, 1.0, 2.0, 1.0, 1.0, 2.0]; // Somatório = 8.5

// 2. Seleção de Elementos do DOM
const inputs = document.querySelectorAll('input[type="range"]');
const btnCalculate = document.getElementById('btn-calculate');
const resultPercent = document.getElementById('result-percent');
const resultLabel = document.getElementById('result-label');
const circle = document.querySelector('.progress-ring__circle');

// Configuração do círculo de progresso (SVG)
const radius = circle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;
circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;

// 3. Atualização visual imediata dos valores nos labels
inputs.forEach(input => {
    input.addEventListener('input', (e) => {
        document.getElementById(`val-${e.target.id}`).textContent = e.target.value;
    });
});

/**
 * Função principal de cálculo
 * Realiza a projeção do vetor do usuário no vetor ideal
 */
function calculateQuality() {
    // Montagem do Vetor X (Valores do Usuário)
    const x = Array.from(inputs).map(input => parseFloat(input.value));
    
    // Vetor Ideal P (Notas máximas)
    const p = [10, 10, 10, 10, 10, 10];
    
    // Identifica a métrica escolhida
    const metrica = document.querySelector('input[name="metrica"]:checked').value;
    
    let produtoInterno = 0;
    let produtoIdeal = 0;

    if (metrica === 'canonica') {
        // Cálculo: <x, p> = Σ x_i * p_i
        for (let i = 0; i < 6; i++) {
            produtoInterno += x[i] * p[i];
            produtoIdeal += p[i] * p[i];
        }
    } else {
        // Cálculo: <x, p>_w = Σ w_i * x_i * p_i
        // Isso atende à propriedade de aditividade e homogeneidade em um espaço ponderado
        for (let i = 0; i < 6; i++) {
            produtoInterno += weights[i] * x[i] * p[i];
            produtoIdeal += weights[i] * p[i] * p[i];
        }
    }

    // Projeção Escalar Normalizada (Resultado entre 0 e 100)
    const score = (produtoInterno / produtoIdeal) * 100;
    
    updateDisplay(score);
}

/**
 * Atualiza a UI com o resultado
 */
function updateDisplay(value) {
    const roundedValue = Math.round(value);
    
    // Animação do número
    resultPercent.textContent = `${roundedValue}%`;
    
    // Animação do círculo SVG
    const offset = circumference - (value / 100) * circumference;
    circle.style.strokeDashoffset = offset;

    // Classificação qualitativa
    if (value >= 80) {
        resultLabel.textContent = "Excelente - Padrão Ouro";
        resultLabel.style.color = "#22c55e";
    } else if (value >= 60) {
        resultLabel.textContent = "Bom - Atende aos requisitos";
        resultLabel.style.color = "#fbbf24";
    } else if (value >= 40) {
        resultLabel.textContent = "Regular - Precisa de melhorias";
        resultLabel.style.color = "#f97316";
    } else {
        resultLabel.textContent = "Precário - Crítico";
        resultLabel.style.color = "#ef4444";
    }
}

// Event Listener para o botão
btnCalculate.addEventListener('click', calculateQuality);

// Inicialização automática
calculateQuality();