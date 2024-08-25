const expenseForm = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const summaryDiv = document.getElementById('summary');
const ctx = document.getElementById('expense-chart').getContext('2d');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let income = parseFloat(localStorage.getItem('income')) || 0;


function renderExpenses() {
    expenseList.innerHTML = '';
    expenses.forEach((expense, index) => {
        const div = document.createElement('div');
        div.className = 'expense-item';
        div.innerHTML = `
            <span>${expense.description} - Rs${expense.amount} (${expense.category})</span>
            <button onclick="editExpense(${index})">Edit</button>
            <button onclick="deleteExpense(${index})">Delete</button>
        `;
        expenseList.appendChild(div);
    });
    updateSummary();
    updateChart();
}

function addExpense(e) {
    e.preventDefault();
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;

    expenses.push({ description, amount, category });
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderExpenses();
    expenseForm.reset();
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderExpenses();
}

function editExpense(index) {
    const expense = expenses[index];
    document.getElementById('description').value = expense.description;
    document.getElementById('amount').value = expense.amount;
    document.getElementById('category').value = expense.category;
    deleteExpense(index);
}

function updateSummary() {
    const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
    const remainingBalance = income - totalExpenses;
    summaryDiv.innerHTML = `
        <h3>Total Expenses: Rs${totalExpenses.toFixed(2)}</h3>
        <h3>Remaining Balance: Rs${remainingBalance.toFixed(2)}</h3>`;
}

function updateChart() {
    const categories = {};
    expenses.forEach(expense => {
        categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
    });

    const labels = Object.keys(categories);
    const data = Object.values(categories);

    if (window.expenseChart) {
        window.expenseChart.destroy();
    }

    window.expenseChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Expenses by Category',
                data: data,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

expenseForm.addEventListener('submit', addExpense);
const incomeInput = document.getElementById('income');
incomeInput.value = income;
incomeInput.addEventListener('input', () => {
    income = parseFloat(incomeInput.value) || 0;
    localStorage.setItem('income', income);
    renderExpenses();
});
renderExpenses();