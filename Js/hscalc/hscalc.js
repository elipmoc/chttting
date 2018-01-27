
let hscalc = {}

hscalc.scriptload = (scriptName) => {
    let head = document.getElementsByTagName("body");
    let script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", scriptName);
    head[0].insertBefore(script, head[0].firstChild);
};

hscalc.load = () => {
    hscalc.scriptload("VariableTable.js");
    hscalc.scriptload("expressionTrees.js");
    hscalc.scriptload("originalTypes.js");
    hscalc.scriptload("intrinsicFuncTable.js");
    hscalc.scriptload("operatorTable.js");
    hscalc.scriptload("lexer.js")
    hscalc.scriptload("parser.js");
};