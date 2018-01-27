//変数を表す型
hscalc.VariableType = class {
    constructor() {
        this._value;
    }
    setValue(value) { this._value = value; }
    getValue() { return this._value; }
};

//関数型
//引数の数が合うまで遅延評価
hscalc.FuncType = class {
    constructor(funcInfo, argList) {
        this._funcInfo = funcInfo;

        if (argList != undefined)
            this._argList = argList.concat();
        else
            this._argList = new Array();
    }

    Do(arg) {
        if (this.needArgs == 0) {
            return this._funcInfo["body"](this._argList);
        }
        if (arg != undefined) {
            let newArgList = this._argList.concat();
            newArgList.push(arg);
            if (this._funcInfo["args"] - newArgList.length == 0)
                return this._funcInfo["body"](newArgList);
            return new hscalc.FuncType(this._funcInfo, newArgList);
        }
        return new hscalc.FuncType(this._funcInfo, this._argList);
    }

    get needArgs() {
        return this._funcInfo["args"] - this._argList.length;
    }
}

hscalc.listShow = (list) => {
    let str = "[";
    while (list.next()) {
        str += String(list.get()) + ",";
    }
    list.reset();
    if (str.length != 1)
        str = str.substr(0, str.length - 1);
    return str + "]";
}

//リスト型
hscalc.ListType = class {

    constructor(array) {
        this._array = array;
        this._index = -1;
    }

    get() { return this._array[this._index]; }

    next() {
        this._index++;
        return this._array.length > this._index;
    }

    reset() { this._index = -1; }

    show() {
        return hscalc.listShow(this);
    }
}

hscalc.MapListType = class {
    constructor(list, f) {
        this._list = list;
        this._f = f;
    }

    get() { return this._f.Do(this._list.get()); }

    next() {
        return this._list.next();
    }

    reset() { this._list.reset(); }

    show() {
        return hscalc.listShow(this);
    }
}

hscalc.RangeListType = class {
    constructor(first, second, end) {
        var firstValue = first;
        var secondValue = second;
        this._delta = secondValue - firstValue;
        this._now = firstValue - this._delta;
        this._init = this._now;
        this._end = end;
    }

    get() { return this._now; }

    next() {
        this._now += this._delta;
        if (this._delta > 0 && this._end >= this._now)
            return true;
        if (this._delta < 0 && this._end <= this._now)
            return true;
        return false;
    }

    reset() { this._now = this._init; }

    show() {
        return hscalc.listShow(this);
    }
}
