
//パース結果の保存するクラス
hscalc.Result = class {
    constructor() {
        this._msg = "";
        this._expr = undefined;
        this._errorFlag = false;
    }

    get expr() {
        return this._expr;
    }

    get msg() {
        return this._msg;
    }

    isSuccess() { return !this._errorFlag; }

    success(expr) { this._expr = expr; this._msg = ""; this._errorFlag = false; }

    error(msg) {
        this._msg += msg + "\r\n";
        this._errorFlag = true;
    }
}

hscalc.Parser = class {
    constructor(tokenList) {
        this._tokenList = tokenList;
        this._nowIndex = 0;
        this._intrinsicFuncTable = new hscalc.IntrinsicFuncTable();
        this._operatorTable = new hscalc.OperatorTable();
        this._variableTable = new hscalc.VariableTable();
    }

    doParse() {
        let result = this.visitExpr();
        if (result.isSuccess())
            return result.expr.result(new hscalc.Environment());
        else
            return result.msg;
    }

    visitExpr() {
        var result = this.visitOperatorExpr(0);
        if (result.isSuccess()) {
            if (this._nowIndex < this._tokenList.length) {
                result.error("文法エラー");
                return result;
            }
        }
        return result;
    }

    visitOperatorExpr(index) {
        if (index >= this._operatorTable.getLength())
            return this.visitFuncCall();
        let op = this._operatorTable.getAt(index);
        if (op["associative"] == "right")
            return this.visitRightBinaryExpr(index);
        if (op["associative"] == "left")
            return this.visitLeftBinaryExpr(index);
    }

    visitRightBinaryExpr(index) {
        var checkPoint = this._nowIndex;
        var left = this.visitOperatorExpr(index + 1);
        if (left.isSuccess()) {
            var nowToken = this._tokenList[this._nowIndex];
            let op = this._operatorTable.getAt(index);
            if (this._nowIndex < this._tokenList.length &&
                nowToken.tokenType == "op" &&
                (nowToken.str == op["name"])) {
                this._nowIndex++;
                let right = this.visitRightBinaryExpr(index);
                if (right.isSuccess())
                    left.success(new hscalc.BinaryExpr(left.expr, right.expr, op));
                else {
                    this._nowIndex = checkPoint;
                    right.error("演算子\"" + op["name"] + "\"の左辺に対応する値がありません");
                    return right;
                }
                nowToken = this._tokenList[this._nowIndex];
            }
            return left;
        }
        this._nowIndex = checkPoint;
        return left;
    }

    visitLeftBinaryExpr(index) {
        var checkPoint = this._nowIndex;
        var left = this.visitOperatorExpr(index + 1);
        if (left.isSuccess()) {
            var nowToken = this._tokenList[this._nowIndex];
            let op = this._operatorTable.getAt(index);
            while (this._nowIndex < this._tokenList.length &&
                nowToken.tokenType == "op" &&
                (nowToken.str == op["name"])) {
                this._nowIndex++;
                let right = this.visitOperatorExpr(index + 1);
                if (right.isSuccess())
                    left.success(new hscalc.BinaryExpr(left.expr, right.expr, op));
                else {
                    this._nowIndex = checkPoint;
                    right.error("演算子\"" + op["name"] + "\"の左辺に対応する値がありません");
                    return right;
                }
                nowToken = this._tokenList[this._nowIndex];
            }
            return left;
        }
        this._nowIndex = checkPoint;
        return left;
    }

    visitFuncCall() {
        var checkPoint = this._nowIndex;
        let result = this.visitFuncName();
        if (result.isSuccess()) {

            while (true) {

                let funcExpr = result.expr;
                /* if (
                     (typeof func != "object") ||
                     (("needArgs" in func) == false)
                 ) {
                     if (!this.visitFuncName().isSuccess()) break;
                     result.error("関数ではないものに引数を渡そうとしました");
                     this._nowIndex = checkPoint;
                     return result;
                 }*/

                let argResult = this.visitFuncName();
                if (argResult.isSuccess())
                    result.success(new hscalc.FuncCallExpr(funcExpr, argResult.expr))
                else
                    break;
            }
        }
        return result;
    }

    visitFuncName() {
        let result = new hscalc.Result();
        if (this._nowIndex >= this._tokenList.length) {
            result.error("文法エラー");
            return result;
        }

        if (this._tokenList[this._nowIndex].tokenType == "num") {
            result.success(new hscalc.ValueExpr(Number(this._tokenList[this._nowIndex].str)));
            this._nowIndex++;
            return result;
        }

        if (this._tokenList[this._nowIndex].tokenType == "identifier") {
            let id = this._tokenList[this._nowIndex].str;
            let funcInfo = this._intrinsicFuncTable.getFuncInfo(id);
            if (funcInfo != null) {
                result.success(new hscalc.FuncCallExpr(new hscalc.ValueExpr(new hscalc.FuncType(funcInfo))));
                this._nowIndex++;
                return result;
            }
            let variableType = this._variableTable.get(id);
            if (variableType) {
                result.success(new hscalc.VariableExpr(id));
                this._nowIndex++;
                return result;
            }
            result.error(id + ":定義されていない識別子です");
            return result;
        }
        result = this.visitWrapExpr();
        if (result.isSuccess())
            return result;
        result = this.visitArrayWrap();
        if (result.isSuccess())
            return result;
        return this.visitLambda();

    }

    visitWrapExpr() {
        let checkPoint = this._nowIndex;
        if (this._tokenList[this._nowIndex].str == "(") {
            this._nowIndex++;
            let result = this.visitOperatorExpr(0);
            if (result.isSuccess()) {
                if (this._nowIndex < this._tokenList.length && this._tokenList[this._nowIndex].str == ")") {
                    this._nowIndex++;
                    return result;
                }
                result.error("左かっこに対応する右かっこがありません");
            }
            this._nowIndex = checkPoint;
            return result;
        }
        let result = new hscalc.Result();
        result.error("文法エラー");
        this._nowIndex = checkPoint;
        return result;
    }

    visitArrayWrap() {
        let checkPoint = this._nowIndex;
        if (this._tokenList[this._nowIndex].str == "[") {
            this._nowIndex++;
            let result = this.visitRangeArray();
            if (result.isSuccess() == false) {
                result = this.visitArray();
            }
            if (result.isSuccess()) {
                if (this._tokenList[this._nowIndex].str == "]") {
                    this._nowIndex++;
                    return result;
                }
                else
                    result.error("]がありません");
            }

            this._nowIndex = checkPoint;
            return result;
        }
        let result = new hscalc.Result();
        result.error("文法エラー");
        return result;
    }

    visitRangeArray() {
        let checkPoint = this._nowIndex;
        let firstResult = this.visitOperatorExpr(0);
        if (firstResult.isSuccess()) {
            if (this._tokenList[this._nowIndex].str == ",") {
                this._nowIndex++;
                let secondResult = this.visitOperatorExpr(0);
                if (secondResult.isSuccess()) {
                    if (this._tokenList[this._nowIndex].str == "..") {
                        this._nowIndex++;
                        let endResult = this.visitOperatorExpr(0);
                        if (endResult.isSuccess()) {
                            let result = new hscalc.Result();
                            result.success(new hscalc.RangeListExpr(
                                firstResult.expr,
                                secondResult.expr,
                                endResult.expr
                            ));
                            return result;
                        }
                    }
                }
            }
        }
        this._nowIndex = checkPoint;
        let result = new hscalc.Result();
        result.error("文法エラー");
        return result;
    }

    visitArray() {
        let checkPoint = this._nowIndex;
        let result = this.visitOperatorExpr(0);
        if (result.isSuccess()) {
            let array = new Array();
            while (true) {
                array.push(result.expr);
                if (this._tokenList[this._nowIndex].str == ",")
                    this._nowIndex++;
                else
                    break;
                result = this.visitOperatorExpr(0);
                if (result.isSuccess() == false) {
                    this._nowIndex = checkPoint;
                    result.error("リストの式が不正です");
                    return result;
                }
            }
            result = new hscalc.Result();
            result.success(new hscalc.ListExpr(array));
            return result;
        }
        else {
            result = new hscalc.Result();
            result.success(new hscalc.ListExpr(new Array()));
            return result;
        }

        this._nowIndex = checkPoint;
        result = new hscalc.Result();
        result.error("文法エラー");
        return result;
    }

    visitLambda() {
        let checkPoint = this._nowIndex;
        if (this._tokenList[this._nowIndex].str == "\\") {
            this._nowIndex++;
            if (
                this._tokenList[this._nowIndex].tokenType == "identifier"
                || this._tokenList[this._nowIndex].str == "_"
            ) {
                if (this._intrinsicFuncTable.getFuncInfo(this._tokenList[this._nowIndex]) == null) {
                    let variableName = this._tokenList[this._nowIndex].str;
                    this._nowIndex++;
                    if (this._tokenList[this._nowIndex].str == "->") {
                        this._nowIndex++;
                        this._variableTable.pushEnvironment();
                        this._variableTable.regist(variableName, new hscalc.VariableType());
                        let result = this.visitOperatorExpr(0);
                        this._variableTable.popEnvironment();
                        if (result.isSuccess()) {
                            result.success(new hscalc.LambdaExpr(variableName, result.expr));
                            return result;
                        }
                    }
                }
            }
        }
        this._nowIndex = checkPoint;
        let result = new hscalc.Result();
        result.error("lambdaエラー");
        return result;
    }
}