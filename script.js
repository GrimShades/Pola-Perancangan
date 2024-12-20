class Payer {
    constructor(name) {
        this.name = name;
        this.total = 0;
    }

    addAmount(amount) {
        this.total += amount;
    }
}

class Item {
    constructor(name, price, quantity, payers) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.payers = payers;
    }

    getTotalCost() {
        return this.price * this.quantity;
    }

    getSharePerPayer() {
        return this.getTotalCost() / this.payers.length;
    }
}

class SplitBillApp {
    constructor() {
        this.payers = [];
        this.items = [];
    }

    addPayer() {
        const payerName = document.getElementById('payerName').value.trim();
        if (payerName) {
            this.payers.push(new Payer(payerName));
            this.updatePayerList();
            this.updatePayerCheckboxes();
            document.getElementById('payerName').value = '';
        } else {
            alert('Please enter a payer name.');
        }
    }

    updatePayerList() {
        const payerList = document.getElementById('payer-list');
        payerList.innerHTML = '';
        this.payers.forEach(payer => {
            const li = document.createElement('li');
            li.textContent = payer.name;
            payerList.appendChild(li);
        });
    }

    updatePayerCheckboxes() {
        const payerCheckboxes = document.getElementById('payer-checkboxes');
        payerCheckboxes.innerHTML = '';
        this.payers.forEach(payer => {
            const div = document.createElement('div');
            div.classList.add('payer-checkbox');

            const label = document.createElement('label');
            label.htmlFor = `payer-${payer.name}`;
            label.textContent = payer.name;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = payer.name;
            checkbox.id = `payer-${payer.name}`;
            checkbox.checked = true;

            div.appendChild(label);
            div.appendChild(checkbox);
            payerCheckboxes.appendChild(div);
        });
    }

    addItem() {
        const itemName = document.getElementById('itemName').value.trim();
        const itemPrice = parseFloat(document.getElementById('itemPrice').value);
        const itemQuantity = parseInt(document.getElementById('itemQuantity').value);

        if (itemName && itemPrice > 0 && itemQuantity > 0) {
            const selectedPayers = Array.from(document.querySelectorAll('#payer-checkboxes input:checked')).map(input => input.value);
            if (selectedPayers.length === 0) {
                alert('Please select at least one payer.');
                return;
            }
            this.items.push(new Item(itemName, itemPrice, itemQuantity, selectedPayers));
            this.updateItemList();
            this.clearItemInputs();
        } else {
            alert('Please enter valid item details.');
        }
    }

    updateItemList() {
        const itemList = document.getElementById('item-list');
        itemList.innerHTML = '';
        this.items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - Rp ${item.price} x ${item.quantity} = Rp ${(item.price * item.quantity).toFixed(2)} 
                (Shared by: ${item.payers.join(', ')})`;
            itemList.appendChild(li);
        });
    }

    clearItemInputs() {
        document.getElementById('itemName').value = '';
        document.getElementById('itemPrice').value = '';
        document.getElementById('itemQuantity').value = '1';
    }

    calculateTotals() {
        const resultDiv = document.getElementById('result');
        const totals = {};
        this.items.forEach(item => {
            const share = item.getSharePerPayer();
            item.payers.forEach(payerName => {
                if (!totals[payerName]) totals[payerName] = 0;
                totals[payerName] += share;
            });
        });
        resultDiv.innerHTML = `<h3>Each Person Pays:</h3>`;
        for (const [payer, total] of Object.entries(totals)) {
            resultDiv.innerHTML += `<p>${payer}: Rp ${total.toFixed(2)}</p>`;
        }
    }

    resetApp() {
        this.payers = [];
        this.items = [];
        document.getElementById('payer-list').innerHTML = '';
        document.getElementById('item-list').innerHTML = '';
        document.getElementById('result').innerHTML = '';
        this.updatePayerCheckboxes();
    }

    saveScreenshot() {
        const resultDiv = document.querySelector('.result-section');
        html2canvas(resultDiv).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'split-bill-result.png';
            link.click();
        });
    }
}

const app = new SplitBillApp();
