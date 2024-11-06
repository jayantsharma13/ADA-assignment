const canvas = document.getElementById('cost-chart');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

let array = [];
let costs = [];
let maxCapacity = 1;
let totalOperations = 50;
let totalCost = 0;
let capacityUpdated = 0;
let isSimulating = false;
let simulationSpeed = 500;

function drawChart() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const barWidth = canvas.width / costs.length;
  const maxCost = Math.max(...costs);

  costs.forEach((cost, index) => {
    const barHeight = (cost / maxCost) * canvas.height;
    ctx.fillStyle = cost > 1 ? '#ff5733' : '#3498db';
    ctx.fillRect(index * barWidth, canvas.height - barHeight, barWidth, barHeight);
  });
}

function simulateInsertions() {
  const operationLimit = document.getElementById('operation-limit').value;
  totalOperations = Math.max(1, parseInt(operationLimit));

  array = [];
  costs = [];
  maxCapacity = 1;
  totalCost = 0;
  capacityUpdated = 0;

  let i = 0;
  isSimulating = true;
  const insertionDetailsElement = document.getElementById('insertion-details');
  insertionDetailsElement.innerHTML = '';

  const totalCostElement = document.getElementById('total-cost');
  const capacityUpdatedElement = document.getElementById('capacity-updated');

  function performInsertion() {
    if (i >= totalOperations) {
      isSimulating = false;

      // Amortized Analysis Calculation
      const amortizedAverageCost = totalCost / totalOperations;
      document.getElementById('amortized-total-cost').textContent = totalCost;
      document.getElementById('amortized-average-cost').textContent = amortizedAverageCost.toFixed(2);

      // Aggregate Analysis Calculation
      const aggregateAverageCost = totalCost / totalOperations;
      document.getElementById('aggregate-total-cost').textContent = totalCost;
      document.getElementById('aggregate-average-cost').textContent = aggregateAverageCost.toFixed(2);

      // Display both Amortized and Aggregate Analysis
      document.getElementById('amortized-analysis').style.display = 'block';
      document.getElementById('aggregate-analysis').style.display = 'block';

      // Display Theory Section
      document.getElementById('analysis-theory').style.display = 'block';

      return;
    }

    let cost = 1;
    if (array.length >= maxCapacity) {
      maxCapacity *= 2;
      cost = array.length + 1;
      capacityUpdated++;
    }
    array.push(i);
    costs.push(cost);
    totalCost += cost;

    drawChart();

    const detailsText = `Insertion ${i + 1}: Cost = ${cost}`;
    insertionDetailsElement.innerHTML = detailsText;

    totalCostElement.innerHTML = totalCost;
    capacityUpdatedElement.innerHTML = capacityUpdated;

    i++;

    if (simulationSpeed > 100) {
      simulationSpeed -= 10;
    }

    setTimeout(performInsertion, simulationSpeed);
  }

  performInsertion();
}

document.getElementById('start-button').addEventListener('click', () => {
  // Hide analysis sections and theory before starting a new simulation
  document.getElementById('amortized-analysis').style.display = 'none';
  document.getElementById('aggregate-analysis').style.display = 'none';
  document.getElementById('analysis-theory').style.display = 'none';
  simulateInsertions();
});
