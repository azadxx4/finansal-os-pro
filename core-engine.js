class CoreEngine {
    constructor(state) {
        this.state = state;
        this.transactionHistory = [];
        this.assetRegistry = new Map();
        this.debtRegistry = new Map();
        this.budgetRegistry = new Map();
    }

    processTransaction(transaction) {
        const { id, type, amount, fromAccountId, toAccountId, personId, category, date, description, tags } = transaction;
        if (!this.validateTransaction(transaction)) {
            throw new Error('Invalid transaction data');
        }
        switch(type) {
            case 'expense': this.processExpense(transaction); break;
            case 'income': this.processIncome(transaction); break;
            case 'transfer': this.processTransfer(transaction); break;
            case 'investment': this.processInvestment(transaction); break;
            default: throw new Error('Unknown transaction type');
        }
        this.transactionHistory.push(transaction);
        this.updateAllDependents();
        return true;
    }

    processExpense(transaction) {
        const account = this.getAccount(transaction.fromAccountId);
        if (account) {
            account.balance -= transaction.amount;
        }
        this.updateBudgetUsage(transaction.category, transaction.amount);
    }

    processIncome(transaction) {
        const account = this.getAccount(transaction.toAccountId);
        if (account) {
            account.balance += transaction.amount;
        }
    }

    processTransfer(transaction) {
        const fromAccount = this.getAccount(transaction.fromAccountId);
        const toAccount = this.getAccount(transaction.toAccountId);
        if (fromAccount && toAccount) {
            fromAccount.balance -= transaction.amount;
            toAccount.balance += transaction.amount;
        }
    }

    processInvestment(transaction) {
        const account = this.getAccount(transaction.fromAccountId);
        if (account) {
            account.balance -= transaction.amount;
        }
    }

    validateTransaction(transaction) {
        return transaction.id && transaction.type && transaction.amount > 0 && transaction.date;
    }

    addAsset(asset) {
        const { id, type, symbol, quantity, buyPrice, personId } = asset;
        if (!id || !type || !symbol || quantity <= 0 || buyPrice <= 0) {
            throw new Error('Invalid asset data');
        }
        const assetData = { ...asset, currentPrice: asset.currentPrice || buyPrice, value: quantity * buyPrice, createdAt: new Date().toISOString() };
        this.assetRegistry.set(id, assetData);
        this.updateNetWorth();
        return assetData;
    }

    updateAssetPrice(assetId, newPrice) {
        const asset = this.assetRegistry.get(assetId);
        if (asset) {
            asset.currentPrice = newPrice;
            asset.value = asset.quantity * newPrice;
            this.updateNetWorth();
        }
    }

    addDebt(debt) {
        const { id, type, amount, person, startDate, dueDate, interest } = debt;
        if (!id || !type || amount <= 0) {
            throw new Error('Invalid debt data');
        }
        const debtData = { ...debt, remaining: amount, paid: 0, payments: [], createdAt: new Date().toISOString() };
        this.debtRegistry.set(id, debtData);
        this.updateNetWorth();
        return debtData;
    }

    payDebt(debtId, amount, date) {
        const debt = this.debtRegistry.get(debtId);
        if (!debt) throw new Error('Debt not found');
        const paymentAmount = Math.min(amount, debt.remaining);
        debt.remaining -= paymentAmount;
        debt.paid += paymentAmount;
        debt.payments.push({ amount: paymentAmount, date });
        this.updateNetWorth();
        return debt;
    }

    addBudget(budget) {
        const { id, category, limit, period, alertThreshold } = budget;
        if (!id || !category || limit <= 0) {
            throw new Error('Invalid budget data');
        }
        const budgetData = { ...budget, spent: 0, remaining: limit, createdAt: new Date().toISOString() };
        this.budgetRegistry.set(id, budgetData);
        return budgetData;
    }

    calculateNetWorth() {
        let total = this.getTotalBalance();
        for (const asset of this.assetRegistry.values()) {
            total += asset.quantity * asset.currentPrice;
        }
        for (const debt of this.debtRegistry.values()) {
            total -= debt.remaining;
        }
        return total;
    }

    updateNetWorth() {
        const netWorth = this.calculateNetWorth();
        this.state.netWorth = netWorth;
        return netWorth;
    }

    updateAllDependents() {
        this.updateNetWorth();
        this.persistState();
    }

    persistState() {
        const stateData = { transactions: this.transactionHistory, assets: Array.from(this.assetRegistry.entries()), debts: Array.from(this.debtRegistry.entries()), budgets: Array.from(this.budgetRegistry.entries()), netWorth: this.state.netWorth };
        localStorage.setItem('finansal-state', JSON.stringify(stateData));
    }
}