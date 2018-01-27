//組み込み演算子を定義しておくテーブル
hscalc.OperatorTable = class {
    constructor() {
        this._opArray = [
            {
                "name": "$", "body": (a, b) => {
                    return a.Do(b);
                }, "associative": "right"
            }
            , { "name": "<|", "body": (a, b) => { return a.Do(b); }, "associative": "right" }
            , { "name": "|>", "body": (a, b) => { return b.Do(a); }, "associative": "left" }
            , {
                "name": "<<|", "body": (b, a) => {
                    return a.Do(b);
                }, "associative": "right"
            }
            , {
                "name": "|>>", "body": (a, b) => {
                    return a.Do(b);
                }, "associative": "left"
            }
            ,
            {
                "name": "<=", "body": (b, a) => {
                    return new
                        hscalc.FuncType(
                        {
                            "body": (x) => { return a.Do(x[0]).Do(b); }, "args": 1
                        }
                        );
                }, "associative": "right"
            },
            {
                "name": "=>", "body": (a, b) => {
                    return new
                        hscalc.FuncType(
                        {
                            "body": (x) => { return a.Do(x[0]).Do(b); }, "args": 1
                        }
                        );
                }, "associative": "left"
            }
            ,
            {
                "name": "<&", "body": (b, a) => {
                    return new
                        hscalc.FuncType(
                        {
                            "body": (x) => { return x[0].Do(a).Do(b); }, "args": 1
                        }
                        );
                }, "associative": "right"
            },
            {
                "name": "&>", "body": (a, b) => {
                    return new
                        hscalc.FuncType(
                        {
                            "body": (x) => { return x[0].Do(a).Do(b); }, "args": 1
                        }
                        );
                }, "associative": "left"
            }
            , { "name": "||", "body": (a, b) => { return a || b; }, "associative": "left" }
            , { "name": "&&", "body": (a, b) => { return a && b; }, "associative": "left" }
            , { "name": "+", "body": (a, b) => { return a + b; }, "associative": "left" }
            , { "name": "-", "body": (a, b) => { return a - b; }, "associative": "left" }
            , { "name": "*", "body": (a, b) => { return a * b; }, "associative": "left" }
            , { "name": "/", "body": (a, b) => { return a / b; }, "associative": "left" }
            , { "name": "^", "body": (a, b) => { return Math.pow(a, b); }, "associative": "right" }
            , {
                "name": "!!", "body": (a, b) => {
                    if (b < 0)
                        return undefined;
                    for (let i = 0; i <= b; i++) {
                        if (a.next() == false)
                            return undefined;
                    }
                    return a.get();
                }, "associative": "left"
            }
            , {
                "name": ".", "body": (a, b) => {
                    return new
                        hscalc.FuncType(
                        {
                            "body": (c) => { return a.Do(b.Do(c[0])); }, "args": 1
                        }
                        );
                }, "associative": "right"
            }

        ]
    }

    getLength() {
        return this._opArray.length;
    }

    getAt(index) {
        return this._opArray[index];
    }

    getOpInfo(opName) {
        this._opArray.forEach((op) => {
            if (op["name"] == opName)
                return op;
        });
        return null;
    }
}