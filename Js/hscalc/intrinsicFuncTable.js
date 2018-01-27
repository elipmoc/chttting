//�g�ݍ��݊֐���o�^���Ă����e�[�u��
hscalc.IntrinsicFuncTable = class {
    constructor() {
        this._funcArray =
            {
                "max": { "body": (a) => { return a[0] > a[1] ? a[0] : a[1] }, "args": 2 }
                , "min": { "body": (a) => { return a[0] > a[1] ? a[1] : a[0] }, "args": 2 }
                , "and": { "body": (a) => { return a[0] && a[1]; }, "args": 2 }
                , "or": { "body": (a) => { return a[0] || a[1]; }, "args": 2 }
                , "mod": { "body": (a) => { return a[0] % a[1]; }, "args": 2 }
                , "equal": { "body": (a) => { return a[0] == a[1] }, "args": 2 }
                , "if": { "body": (a) => { return a[0] ? a[1] : a[2] }, "args": 3 }
                , "flip": { "body": (a) => { return a[0].Do(a[2]).Do(a[1]); }, "args": 3 }
                , "sub": { "body": (a) => { return a[0] - a[1]; }, "args": 2 }
                , "add": { "body": (a) => { return a[0] + a[1]; }, "args": 2 }
                , "mul": { "body": (a) => { return a[0] * a[1]; }, "args": 2 }
                , "div": { "body": (a) => { return a[0] / a[1]; }, "args": 2 }
                , "minus": { "body": (a) => { return -a[0]; }, "args": 1 }
                , "pi": { "body": (a) => { return Math.PI; }, "args": 0 }
                , "pow": { "body": (a) => { return Math.pow(a[0], a[1]); }, "args": 2 }
                , "sin": { "body": (a) => { return Math.sin(a[0]); }, "args": 1 }
                , "cos": { "body": (a) => { return Math.cos(a[0]); }, "args": 1 }
                , "tan": { "body": (a) => { return Math.tan(a[0]); }, "args": 1 }
                , "abs": { "body": (a) => { return Math.abs(a[0]); }, "args": 1 }
                , "true": { "body": (a) => { return true; }, "args": 0 }
                , "false": { "body": (a) => { return false; }, "args": 0 }
                , "not": { "body": (a) => { return !a[0]; }, "args": 1 }
                , "map": { "body": (a) => { return new hscalc.MapListType(a[0], a[1]); }, "args": 2 }
                , "show": { "body": (a) => { return a[0].show(); }, "args": 1 }
                , "alert": { "body": (a) => { alert(a[0]); return a[0]; }, "args": 1 }
                , "fold": {
                    "body": (a) => {
                        let temp = undefined;
                        if (a[1].next()) {
                            temp = a[1].get();
                            while (a[1].next()) {
                                temp = a[0].Do(temp).Do(a[1].get());
                            }
                        }
                        a[1].reset();
                        return temp;
                    }, "args": 2
                }
                , "merge": {
                    "body": (a) => {
                        return new
                            hscalc.FuncType(
                            {
                                "body": (b) => { return a[0].Do(a[1].Do(b[0])); }, "args": 1
                            }
                            );
                    }
                    , "args": 2
                }
                , "ycomb": {
                    "body": (f) => {
                        return (a => a.Do(a))(
                            new hscalc.FuncType(
                                {
                                    "body": a => f[0].Do(
                                        new hscalc.FuncType(
                                            {
                                                "body": (x) => { return a[0].Do(a[0]).Do(x[0]); }, "args": 1
                                            }
                                        )
                                    ),
                                    "args": 1
                                }));
                    }
                    , "args": 1
                }
            }
    }

    getFuncInfo(funcName) {
        if (funcName in this._funcArray)
            return this._funcArray[funcName];
        return null;
    }
}