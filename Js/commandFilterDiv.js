
class CommandFilter {
  constructor() {
    this._bindCommandList = new BindCommandList();
    this._bindCommandList.addCommand("931", new ImageCommand("https://pbs.twimg.com/profile_images/510615322307461120/o-vKGUzY_400x400.jpeg"));
  }

  doCommandFilter(msg) {
    const regSlash = new RegExp("^/", "g");
    const matchText = msg.match(regSlash);
    if (matchText != null) {
      msg = msg.replace(regSlash, "");
      const regCommandName = new RegExp(/^([a-z]|[A-Z]|[0-9])+/, "g");
      const commandName = msg.match(regCommandName);
      return this._bindCommandList.doCommand(commandName,undefined);
    }else{
      return htmlEscape(msg);
    }
  }
}

class ImageCommand {
  constructor(imgUrl) {
    this._imgUrl = imgUrl;
  }

  doCommand() {
    return ('<img src="' + this._imgUrl + '" width="100" height="100">');
  }
}

class BindCommandList {
  constructor() {
    this._list = {};
  }

  addCommand(commandName, command) {
    this._list[commandName] = command;
  }

  doCommand(commandName, param) {
    if (this._list.hasOwnProperty(commandName) == true) {
      return this._list[commandName].doCommand(param);
    } else {
      return "存在しないコマンド名";
    }
  }
}
function htmlEscape(htmlText) {
  return $('<div/>').text(htmlText).html();
}
