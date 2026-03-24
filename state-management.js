// State Management module

class GlobalState {
    constructor() {
        this.state = {};
        this.listeners = {};
    }

    // Get the current state
    getState(key) {
        return this.state[key];
    }

    // Set the state
    setState(key, value) {
        this.state[key] = value;
        this.notifyListeners(key);
    }

    // Subscribe to state changes
    subscribe(key, listener) {
        if (!this.listeners[key]) {
            this.listeners[key] = [];
        }
        this.listeners[key].push(listener);
    }

    // Notify listeners of state change
    notifyListeners(key) {
        if (this.listeners[key]) {
            for (const listener of this.listeners[key]) {
                listener(this.state[key]);
            }
        }
    }
}

class EventSystem {
    constructor() {
        this.events = {};
    }

    // Register an event listener
    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    // Emit an event
    emit(event, data) {
        if (this.events[event]) {
            for (const listener of this.events[event]) {
                listener(data);
            }
        }
    }
}

class TransactionEngine {
    constructor(state) {
        this.state = state;
    }

    // Execute a transaction
    execute(transaction) {
        // logic for executing a transaction
        // e.g., modifying the global state 
        // This should ensure state is updated and events are emitted
    }
}

// Usage example
const state = new GlobalState();
const events = new EventSystem();
const transactionEngine = new TransactionEngine(state);

state.subscribe('balance', (newBalance) => {
    console.log('Balance updated to:', newBalance);
});

// Execute a transaction
// transactionEngine.execute(someTransaction);

export { GlobalState, EventSystem, TransactionEngine };