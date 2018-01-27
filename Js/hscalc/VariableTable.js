hscalc.VariableTable = class {
    constructor() {
        this._environment = new Array();
        this._environment.push({});
    }
    get(name) {
        for (let i = this._environment.length - 1; i >= 0; i--) {
            if (this._environment[i][name]) {
                return this._environment[i][name];
            }
        }
        return undefined;
    }
    regist(name, variable) { this._environment[this._environment.length - 1][name] = variable; }
    pushEnvironment() { this._environment.push({}); }
    popEnvironment() { this._environment.pop(); }
};

hscalc.Environment = class {
    constructor(states) {
        if (states == undefined)
            this._states = {};
        else
            this._states = states;
    }

    getState(name) {
        return this._states[name];
    }

    setState(name, value) {
        let newStates = {};
        Object.assign(newStates, this._states);
        newStates[name] = value;
        return new hscalc.Environment(newStates);
    }

}