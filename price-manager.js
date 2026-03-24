const axios = require('axios');

class PriceManager {
    constructor() {
        this.cache = {};
        this.updatePrices();
        setInterval(() => this.updatePrices(), 60000); // Update every 60 seconds
    }

    async fetchCryptoPrices() {
        try {
            const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin&vs_currencies=usd');
            this.cache.crypto = response.data;
        } catch (error) {
            console.error('Error fetching crypto prices:', error);
        }
    }

    async fetchForexRates() {
        try {
            const response = await axios.get('https://api.frankfurter.app/latest?from=USD&to=EUR');
            this.cache.forex = response.data;
        } catch (error) {
            console.error('Error fetching forex rates:', error);
        }
    }

    getGoldPrices() {
        // Mock data for gold prices (in USD)
        this.cache.gold = {
            '2026-03-24': 1800, // Mock price
        };
    }

    async fetchBISTPrices() {
        try {
            // Replace with the actual API endpoint for BIST prices
            const response = await axios.get('https://api.example.com/bist_prices');
            this.cache.bist = response.data;
        } catch (error) {
            console.error('Error fetching BIST prices:', error);
        }
    }

    async updatePrices() {
        await this.fetchCryptoPrices();
        await this.fetchForexRates();
        this.getGoldPrices();
        await this.fetchBISTPrices();
        console.log('Prices updated:', this.cache);
    }

    getPrices() {
        return this.cache;
    }
}

module.exports = PriceManager;

// Usage
// const priceManager = new PriceManager();
// priceManager.getPrices();
