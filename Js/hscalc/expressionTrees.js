//値を表す式
hscalc.ValueExpr = class {
    constructor(value) {
        this._value = value;
    }
    result(environment) { return this._value; }
    get needArgs() { return 0; }
};

//新提案の二項演算子を表す式
hscalc.BinaryExpr = class {
    constructor(left, right, opInfo) {
        this._left = left;
        this._right = right;
        this._opInfo = opInfo;
    }
    result(environment) {
        var leftValue = this._left.result(environment);
        var rightValue = this._right.result(environment);
        return this._opInfo["body"](leftValue, rightValue);
    }

    get needArgs() { return 0; }
}

//変数を表す式
hscalc.VariableExpr = class {
    constructor(name) {
        this._name = name;
    }
    result(environment) {
        return environment.getState(this._name);
    }
}

//ラムダ式を表す式
hscalc.LambdaExpr = class {
    constructor(name, bodyExpr) {
        this._bodyExpr = bodyExpr;
        this._name = name;
    }
    result(environment) {
        let funcInfo =
            {
                "body": (a) => {
                    return this._bodyExpr.result(environment.setState(this._name, a[0]));
                }, "args": 1
            };
        return new hscalc.FuncType(funcInfo);
    }
}

//関数を呼び出しを表す式
hscalc.FuncCallExpr = class {
    //（関数型,引数一つ）
    constructor(funcExpr, arg) {
        this._funcExpr = funcExpr;
        this._arg = arg;
    }
    result(environment) {
        if (this._arg != undefined) {
            return this._funcExpr.result(environment).Do(this._arg.result(environment));
        }
        return this._funcExpr.result(environment).Do();

    }

    get needArgs() {
        return this._funcType.needArgs;
    }
}

//Listを生成する式
hscalc.ListExpr = class {
    constructor(exprArray) {
        this._exprArray = exprArray;
    }
    result(environment) {
        return new hscalc.ListType(this._exprArray.map(x => x.result(environment)));
    }
}

hscalc.RangeListExpr = class {
    constructor(first, second, end) {
        this._first = first;
        this._second = second;
        this._end = end;
    }
    result(environment) {
        return new hscalc.RangeListType(
            this._first.result(environment),
            this._second.result(environment),
            this._end.result(environment));
    }
}

