const form = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const tipElement = document.getElementById('tip');
const themeToggle = document.getElementById('theme-toggle');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

document.addEventListener('DOMContentLoaded', () => {
  applyStoredTheme();
  renderExpenses();
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
  themeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const description = document.getElementById('description').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;

  if (!description || isNaN(amount) || amount <= 0) {
    alert('🚫 Please enter a valid description and amount.');
    return;
  }

  const newExpense = { description, amount, category };
  expenses.push(newExpense);
  form.reset();
  updateStorageAndRender();
});

function renderExpenses() {
  expenseList.innerHTML = '';

  expenses.forEach((expense, index) => {
    const item = document.createElement('div');
    item.className = 'expense-item';

    item.innerHTML = `
      <span>
        <strong>${expense.description}</strong><br>
        <small>$${expense.amount.toFixed(2)} — <em>${expense.category}</em></small>
      </span>
      <button class="delete-btn" title="Remove expense">&times;</button>
    `;

    item.querySelector('.delete-btn').addEventListener('click', () => deleteExpense(index));
    expenseList.appendChild(item);
  });

  generateSmartTip();
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  updateStorageAndRender();
}

function updateStorageAndRender() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
  renderExpenses();
}

function generateSmartTip() {
  if (expenses.length === 0) {
    tipElement.textContent = '📊 Start tracking your expenses to receive smart insights!';
    return;
  }

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const foodTotal = expenses.filter(e => e.category === 'Food')
    .reduce((sum, e) => sum + e.amount, 0);

  if (foodTotal > total * 0.4) {
    tipElement.textContent = '🍔 Spending a lot on food? Try preparing meal at home!';
  } else if (total > 500) {
    tipElement.textContent = '💸 Over $500 in expenses? Time to budget smart!';
  } else {
    tipElement.textContent = '✅ Nice! Your spending looks balanced.';
  }
}

function applyStoredTheme() {
  const darkPref = localStorage.getItem('darkMode');
  const isDark = darkPref === 'enabled';
  document.body.classList.toggle('dark', isDark);
  themeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
}