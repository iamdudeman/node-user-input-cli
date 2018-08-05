const ConsoleAction = require('./ConsoleAction');
const userInputUtils = require('./userInputUtils');

class UserInputLoop {
  constructor(actionPromptText = 'Action:  ') {
    this.consoleActions = [];
    this.actionPromptText = actionPromptText;
  }

  addConsoleAction(id, helpText, action) {
    this.consoleActions.push(new ConsoleAction(id, helpText, action));
  }

  addQuitIfNotExist() {
    if (!this.consoleActions.some(action => action.id === 'quit')) {
      this.addConsoleAction('quit', 'ends the program', () => process.exit());
    }
  }

  addHelpIfNotExist() {
    if (!this.consoleActions.some(action => action.id === 'help')) {
      this.addConsoleAction('help', 'lists options', () => {
        console.log('--command list--');
        this.consoleActions.forEach(action => {
          console.log(action.getId() + ':', action.getHelpText());
        });
        console.log();
      });
    }
  }

  start() {
    this.addQuitIfNotExist();
    this.addHelpIfNotExist();

    userInputUtils.promptUserInput(this.actionPromptText)
      .then(input => userInputUtils.handleChoice(input, this.consoleActions, this.actionPromptText));
  }
}

module.exports = UserInputLoop;
