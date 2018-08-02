module.exports = class ConsoleAction {
  constructor(id, helpText, action) {
    this.id = id;
    this.helpText = helpText;
    this.action = action;
  }

  callAction() {
    return this.action(...arguments);
  }

  getId() {
    return this.id;
  }

  getHelpText() {
    return this.helpText;
  }
}
