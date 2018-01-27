//トークンのオブジェクト
hscalc.Token = class {
    constructor(tokenType, str) {
        this._str = str;
        this._tokenType = tokenType;
    }

    get str() { return this._str; }
    get tokenType() { return this._tokenType; }
}

//字句解析が返す結果のオブジェクト
hscalc.TokenResult = class {
    constructor(errorFlag, tokenList) {
        this._errorFlag = errorFlag;
        this._tokenList = tokenList;
    }

    get tokenList() {
        return this._tokenList;
    }

    get errorFlag() {
        return this._errorFlag;
    }
}

//字句解析
hscalc.lexer = (inputText) => {
    var tokenList = new Array();
    var numRe = /^[0-9]+(\.[0-9]+)?/;
    var opRe = /^[\+\-\*\/÷×＊\.$\^]|^(&&)|^(\|\|)|^(!!)|^(<<\|)|^(\|>>)|^(<\|)|^(\|>)|^(&>)|^(<&)|^(=>)|^(<=)/;
    var simbolRe = /^[()\[\],\\_]|^(\.\.)|^(->)/;
    var identifierRe = /^[a-z]([a-z]|[A-Z]|[0-9])*/;
    var skipRe = /^ /;
    var temp;
    while (true) {
        temp = numRe.exec(inputText);
        if (temp != null) {
            inputText = inputText.substr(temp[0].length);
            tokenList.push(new hscalc.Token("num", temp[0]));
            continue;
        }
        temp = simbolRe.exec(inputText);
        if (temp != null) {
            inputText = inputText.substr(temp[0].length);
            tokenList.push(new hscalc.Token("symbol", temp[0]));
            continue;
        }
        temp = opRe.exec(inputText);
        if (temp != null) {
            inputText = inputText.substr(temp[0].length);
            tokenList.push(new hscalc.Token("op", temp[0]));
            continue;
        }
        temp = identifierRe.exec(inputText);
        if (temp != null) {
            inputText = inputText.substr(temp[0].length);
            tokenList.push(new hscalc.Token("identifier", temp[0]));
            continue;
        }
        temp = skipRe.exec(inputText);
        if (temp != null) {
            inputText = inputText.substr(temp[0].length);
            continue;
        }
        break;
    }
    return new hscalc.TokenResult(inputText.length != 0, tokenList);
}