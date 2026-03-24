class Dashboard {
    constructor() {
        this.transactions = [];
        this.assets = [];
        this.debts = [];
        this.budgets = [];
    }

    addTransaction(transaction) {
        this.transactions.push(transaction);
    }

    addAsset(asset) {
        this.assets.push(asset);
    }

    addDebt(debt) {
        this.debts.push(debt);
    }

    addBudget(budget) {
        this.budgets.push(budget);
    }

    calculateNetWorth() {
        const totalAssets = this.assets.reduce((total, asset) => total + asset.value, 0);
        const totalDebts = this.debts.reduce((total, debt) => total + debt.amount, 0);
        return totalAssets - totalDebts;
    }
}