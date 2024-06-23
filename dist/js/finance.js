const graphElements = {
    incomeBar: document.querySelector('.incomeBar'),
    expenseBar: document.querySelector('.expenseBar'),
    savingBar: document.querySelector('.savingBar'),
    extraBar: document.querySelector('.extraBar')
};

const financeFinder = document.getElementById('financeFinder');
const totalContainer = document.querySelector('.totalContainer');
const customAlert = document.getElementById('customAlert');

let selectedFinanceId;

function updateGraph(type, actual, budget) {
    const percentage = budget > 0 ? (actual / budget) * 100 : 0;
    const dashOffset = 420 - 420 * (Math.min(percentage, 100) / 100);
    graphElements[`${type}Bar`].style.strokeDashoffset = dashOffset;
    document.querySelector(`.number${type.charAt(0).toUpperCase() + type.slice(1)}s`).textContent = `${percentage.toFixed(0)}%`;
}

function updateActualGraph(sum, exp, sav) {
    const expPercent = sum > 0 ? (exp / sum) * 100 : 0;
    const savPercent = sum > 0 ? (sav / sum) * 100 : 0;
    document.querySelector('.savBarActual').style.strokeDashoffset = 420 - 420 * (savPercent / 100);
    document.querySelector('.expBarActual').style.strokeDashoffset = 420 - 420 * (expPercent / 100);
}

function updateBudgetGraph(sum, exp, sav) {
    const expPercent = sum > 0 ? (exp / sum) * 100 : 0;
    const savPercent = sum > 0 ? (sav / sum) * 100 : 0;
    document.querySelector('.savBarBudget').style.strokeDashoffset = 420 - 420 * (savPercent / 100);
    document.querySelector('.expBarBudget').style.strokeDashoffset = 420 - 420 * (expPercent / 100);
}

function formatCurrency(amount) {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

function displayFinanceDetails(finance, totals) {
    totalContainer.innerHTML = `<div class="total labels">
        <div class="billName">Name</div>
        <div class="billDate">Date</div>
        <div class="budget">Budget</div>
        <div class="actual">Actual</div>
        <div class="billCategory">Act/Bud</div>
        <div class="remain">Remain</div>
    </div>`;

    for (const type of ['income', 'expense', 'saving', 'extra']) {
        finance[`${type}Bills`].forEach(bill => {
            const billElement = document.createElement('div');
            billElement.classList.add('total', type);

            billElement.innerHTML = `
                        <div class="billName">${bill.name}</div>
                        <div class="billDate">${new Date(bill.date).toLocaleDateString('vi-VN')}</div>
                        <div class="budget">${formatCurrency(bill.budget)}</div>
                        <div class="actual">${formatCurrency(bill.actual)}</div>
                        <div class="billCategory">${((bill.budget !== 0) ? bill.actual / bill.budget * 100 : 0).toFixed(1)} %</div>
                        <div class="remain">${formatCurrency(bill.budget - bill.actual)}</div>
                    `;
            billElement.addEventListener('click', () => {
                showBillDetails(bill, false);
            });

            totalContainer.appendChild(billElement);
        });
    }
    const summaryElement = document.createElement('div');
    summaryElement.classList.add('total', 'labels');
    summaryElement.innerHTML = `
    <div class="billName">Sumary: </div>
    <div class="billDate"></div>
    <div class="budget">${formatCurrency(totals.budgetTotal)}</div>
    <div class="actual">${formatCurrency(totals.actualTotal)}</div>
    <div class="billCategory">${((totals.budgetTotal !== 0) ? totals.actualTotal / totals.budgetTotal * 100 : 0).toFixed(1)} %</div>
    <div class="remain">${formatCurrency(totals.budgetTotal - totals.actualTotal)}</div>
  `;
    totalContainer.appendChild(summaryElement);
}

financeFinder.addEventListener('change', () => {
    selectedFinanceId = financeFinder.value;
    document.querySelector('.graphContainer').style.display = 'flex';
    document.querySelector('.totalContainer').style.display = 'flex';
    if (selectedFinanceId) {
        fetch(`/api/finances/${selectedFinanceId}`)
            .then(res => res.json())
            .then(data => {
                if (!data || !data.finance) {
                    console.error("Error: Finance data not found");
                    document.querySelector('.graphContainer').style.display = 'none';
                    document.querySelector('.totalContainer').style.display = 'none';
                    return;
                }
                const { finance, totals } = data;
                displayFinanceDetails(finance, totals);
                updateGraph('income', totals.income.actual, totals.income.budget);
                updateGraph('expense', totals.expense.actual, totals.expense.budget);
                updateGraph('saving', totals.saving.actual, totals.saving.budget);
                updateGraph('extra', totals.extra.actual, totals.income.actual);
                updateActualGraph(totals.income.actual, totals.expense.actual, totals.saving.actual);
                updateBudgetGraph(totals.income.budget, totals.expense.budget, totals.saving.budget);
            })
            .catch(error => {
                console.error('Error fetching finance details:', error);
            });
    }
});

window.addEventListener('load', async () => {
    try {
        const response = await fetch('/api/finances');
        if (!response.ok) {
            throw new Error('Failed to fetch finances');
        }
        const finances = await response.json();
        finances.forEach(finance => {
            const option = document.createElement('option');
            option.value = finance._id;
            option.text = finance.name;
            financeFinder.add(option);
        });

        if (finances.length > 0) {
            fetchFinanceDetails(finances[0]._id);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

async function fetchFinanceDetails(financeId) {
    try {
        const response = await fetch(`/api/finances/${financeId}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch finance details');
        }
        const { finance, totals } = await response.json();
        displayFinanceDetails(finance, totals);
        updateGraph('income', totals.income.actual, totals.income.budget);
        updateGraph('expense', totals.expense.actual, totals.expense.budget);
        updateGraph('saving', totals.saving.actual, totals.saving.budget);
        updateGraph('extra', totals.extra.actual, totals.income.actual);
        updateActualGraph(totals.income.actual, totals.expense.actual, totals.saving.actual);
        updateBudgetGraph(totals.income.budget, totals.expense.budget, totals.saving.budget);
    } catch (error) {
        console.error('Error fetching finance details:', error);
        customAlert.textContent = error.message;
        customAlert.style.display = 'block';
        setTimeout(() => {
            customAlert.style.display = 'none';
        }, 1000);
    }
}

function showBillDetails(bill, isNewBill) {
    const overlay = document.getElementById('billDetailsOverlay');
    const billDetailsContainer = document.getElementById('billDetailsContainer');

    const billName = isNewBill ? "" : bill.name;
    const billDate = isNewBill ? new Date().toISOString().split('T')[0] : new Date(bill.date).toISOString().split('T')[0];
    const billBudget = isNewBill ? 0 : bill.budget;
    const billActual = isNewBill ? 0 : bill.actual;
    const billType = isNewBill ? "expense" : bill.type;
    const billDescription = isNewBill ? "" : bill.description;

    billDetailsContainer.innerHTML = `
    <h2>${isNewBill ? 'New Bill' : 'Bill Details'}</h2>
    <p><strong>Name:</strong> <input type="text" id="billName" value="${billName}" /></p>
    <p><strong>Date:</strong> <input type="date" id="billDate" value="${billDate}" /></p>
    <p><strong>Budget:</strong> <input type="number" id="billBudget" value="${billBudget}" /></p>
    <p><strong>Actual:</strong> <input type="number" id="billActual" value="${billActual}" /></p>
    <p><strong>Type:</strong>
      <select id="billType">
        <option value="income" ${billType === 'income' ? 'selected' : ''}>Income</option>
        <option value="expense" ${billType === 'expense' ? 'selected' : ''}>Expense</option>
        <option value="saving" ${billType === 'saving' ? 'selected' : ''}>Saving</option>
        <option value="extra" ${billType === 'extra' ? 'selected' : ''}>Extra</option>
      </select>
    </p>
    <p style="justify-content: center"><strong>Description</strong></p>
    <textarea id="billDescription">${billDescription}</textarea>
    <div class="bill-actions">
      <button class="${isNewBill ? 'create-bill' : 'save-bill'}">${isNewBill ? 'Create' : 'Save'}</button>
      ${!isNewBill ? `<button class="delete-bill">Delete</button>` : ''}
      <button class="cancel-bill">Cancel</button>
    </div>
  `;

    overlay.style.display = 'flex';
    const cancelButton = document.querySelector('.cancel-bill');
    cancelButton.addEventListener('click', closePopup);
    // document.querySelector('#billDetailsOverlay').addEventListener('click', closePopup);

    function closePopup() {
        overlay.style.display = 'none';
    }

    if (isNewBill === false) {
        const deleteButton = document.querySelector('.delete-bill');
        deleteButton.addEventListener('click', async () => {
            if (!confirm('Bạn có chắc chắn muốn xóa mục này?')) {
                return;
            }

            try {
                let selectedFinanceId = financeFinder.value;
                const res = await fetch(`/api/finances/${selectedFinanceId}/bills/${bill._id}`, {
                    method: 'DELETE'
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || 'Xóa mục không thành công');
                }

                closePopup();
                fetchFinanceDetails(selectedFinanceId);
            } catch (error) {
                console.error('Lỗi khi xóa mục:', error);
                customAlert.textContent = error.message;
                customAlert.style.display = 'block';
                setTimeout(() => {
                    customAlert.style.display = 'none';
                }, 1000);
            }
        });
        const saveButton = document.querySelector('.save-bill');
        saveButton.addEventListener('click', async () => {
            const newBillData = {
                name: document.querySelector('#billName').value,
                date: document.querySelector('#billDate').value,
                budget: parseFloat(document.querySelector('#billBudget').value),
                actual: parseFloat(document.querySelector('#billActual').value),
                type: document.querySelector('#billType').value,
                description: document.querySelector('#billDescription').value,
                oldType: bill.type
            };
            try {
                let selectedFinanceId = financeFinder.value;
                const res = await fetch(`/api/finances/${selectedFinanceId}/bills/${bill._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newBillData)
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || 'Cập nhật mục không thành công');
                }

                closePopup();
                fetchFinanceDetails(selectedFinanceId);
            } catch (error) {
                console.error('Lỗi khi cập nhật mục:', error);
                customAlert.textContent = error.message;
                customAlert.style.display = 'block';
                setTimeout(() => customAlert.style.display = 'none', 1000);
            }
        });
    } else {
        const createButton = document.querySelector('.create-bill');
        if (createButton) {
            createButton.addEventListener('click', async () => {
                const newBillData = {
                    name: document.querySelector('#billName').value,
                    date: document.querySelector('#billDate').value,
                    budget: parseFloat(document.querySelector('#billBudget').value),
                    actual: parseFloat(document.querySelector('#billActual').value),
                    type: document.querySelector('#billType').value,
                    description: document.querySelector('#billDescription').value
                };

                try {
                    selectedFinanceId = financeFinder.value;
                    const res = await fetch(`/api/finances/${selectedFinanceId}/bills`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newBillData)
                    });

                    if (!res.ok) {
                        const errorData = await res.json();
                        throw new Error(errorData.error || 'Tạo mục không thành công');
                    }

                    closePopup();
                    fetchFinanceDetails(selectedFinanceId);
                } catch (error) {
                    console.error('Lỗi khi tạo mục:', error);
                    customAlert.textContent = error.message;
                    customAlert.style.display = 'block';
                    setTimeout(() => {
                        customAlert.style.display = 'none';
                    }, 1000);
                }
            });
        }
    }
}

const addBillButton = document.getElementById('addBillButton');
addBillButton.addEventListener('click', () => {
    showBillDetails(null, true);
});

const newFinanceButton = document.getElementById('newFinance');
newFinanceButton.addEventListener('click', async () => {
    const newFinanceName = prompt('Nhập tên kế hoạch tài chính mới:', 'Kế hoạch mới');
    if (newFinanceName) {
        try {
            const res = await fetch('/api/finances', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newFinanceName })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Tạo kế hoạch không thành công');
            }
        } catch (error) {
            console.error('Lỗi khi tạo kế hoạch:', error);
            customAlert.textContent = error.message;
            customAlert.style.display = 'block';
            setTimeout(() => {
                customAlert.style.display = 'none';
            }, 5000);
        }
    }
});

async function loadFinances() {
    try {
        const response = await fetch('/api/finances');
        if (!response.ok) {
            throw new Error('Failed to fetch finances');
        }
        const finances = await response.json();
        financeFinder.innerHTML = '';
        finances.forEach(finance => {
            const option = document.createElement('option');
            option.value = finance._id;
            option.text = finance.name;
            financeFinder.add(option);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}
