
let hscalc = {}

hscalc.scriptload = (scriptName) => {
    let head = document.getElementsByTagName("body");
    let script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", scriptName);
    head[0].insertBefore(script, head[0].firstChild);
};

hscalc.load = () => {
    hscalc.scriptload("Js/hscalc/VariableTable.js");
    hscalc.scriptload("Js/hscalc/expressionTrees.js");
    hscalc.scriptload("Js/hscalc/originalTypes.js");
    hscalc.scriptload("Js/hscalc/intrinsicFuncTable.js");
    hscalc.scriptload("Js/hscalc/operatorTable.js");
    hscalc.scriptload("Js/hscalc/lexer.js")
    hscalc.scriptload("Js/hscalc/parser.js");
};