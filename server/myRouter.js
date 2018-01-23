const fs = require('fs');
const router = require('router');
const finalhandler = require('finalhandler');

exports.createRouter = () => {
    let myRouter = router();
    myRouter.get("/Css/:path", (req, res) => {
        sendCss(res, "./Css/" + req.params.path);
    });
    myRouter.get("/Js/:path", (req, res) => {
        sendJs(res, "./Js/" + req.params.path);
    });
    myRouter.get("/:path", (req, res) => {
        sendHtml(res, "./Html/" + req.params.path);
    });

    return (req, res) => {
        myRouter(req, res, finalhandler(req, res));
    }
}

function sendHtml(res, path) {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.end(fs.readFileSync(path));
}

function sendCss(res, path) {
    res.writeHead(200, {
        'Content-Type': 'text/css'
    });
    res.end(fs.readFileSync(path));
}

function sendJs(res, path) {
    res.writeHead(200, {
        'Content-Type': 'text/plane'
    });
    res.end(fs.readFileSync(path));
}
function sendPng(res, path) {
    res.writeHead(200, {
        'Content-Type': 'image/png'
    });
    res.end(fs.readFileSync(path));
}