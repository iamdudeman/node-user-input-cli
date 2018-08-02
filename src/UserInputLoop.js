const ConsoleAction = require('./ConsoleAction');
const readline = require('readline');

function promptUserInput(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(question, choice => {
      rl.close();
      resolve(choice);
    });
  });
}

function handleChoice(input, consoleActions, actionPromptText) {
  const parts = input.split(' ');
  const choice = parts[0];
  const action = consoleActions.find(action => action.id === choice);

  if (action) {
    action.callAction(...parts.filter(part => part !== choice));
  } else {
    console.log('"help" for help');
  }

  return promptUserInput(actionPromptText).then(input => handleChoice(input, consoleActions, actionPromptText));
}

module.exports = class UserInputLoop {
  constructor(actionPromptText = 'Action: ') {
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

    promptUserInput(this.actionPromptText).then(input => handleChoice(input, this.consoleActions, this.actionPromptText));
  }
}
