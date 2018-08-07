const ConsoleAction = require('./ConsoleAction');
const userInputUtils = require('./userInputUtils');

class UserInputLoopBuilder {
  constructor() {
    this.consoleActions = [];
    this.choiceNotHandledCallback = () => {};
  }

  addConsoleAction(id, helpText, action) {
    if (this.consoleActions.some(action => action.getId() == id)) {
      throw Error('Cannot reuse Action id ' + id);
    }

    this.consoleActions.push(new ConsoleAction(id, helpText, action));
    return this;
  }

  setActionPromptChoice(actionPromptText) {
    this.actionPromptText = actionPromptText;
    return this;
  }

  setChoiceNotHandledCallback(choiceNotHandledCallback) {
    this.choiceNotHandledCallback = choiceNotHandledCallback;
    return this;
  }

  setHelpId() {
    return this.addConsoleAction('help', '', () => {
      this.consoleActions.forEach(action => {
        if (action.getId() != 'help') {
          console.log(action.getId() + ':', action.getHelpText());
        }
      });
    });
  }

  setQuitActionId(id, helpText = 'ends the program') {
    return this.addConsoleAction(id, helpText, () => process.exit());
  }

  start() {
    userInputUtils.promptUserInput(this.actionPromptText)
      .then(input => {
        let isChoiceHandled = userInputUtils.handleChoice(input, this.consoleActions);

        if (!isChoiceHandled) {
          this.choiceNotHandledCallback && this.choiceNotHandledCallback();
        }

        // Recursive so it loops
        this.start();
      });
  }
}

module.exports = UserInputLoopBuilder;
