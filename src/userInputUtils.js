const readline = require('readline');

/**
 * Ask the user a question and wait for response.
 *
 * @param {string} question - The question to ask the user
 * @returns {Promise<string>} Resolves with the string the user entered
 */
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

/**
 * Handles the choice of the user using an array of ConsoleActions. Returns whether or not
 * a ConsoleAction properly handled the input or not.
 *
 * @param {string} input - The user's inut
 * @param {Array<ConsoleAction>} consoleActions - All the ConsoleActions that can possibly handle the choice
 * @returns {bool} True if choice has been handled by a ConsoleAction
 */
function handleChoice(input, consoleActions) {
  const parts = input.split(' ');
  const choice = parts[0];
  const action = consoleActions.find(action => action.id === choice);

  if (action) {
    action.callAction(...parts.filter(part => part !== choice));
  }

  return !!action;
}

module.exports = {
  handleChoice,
  promptUserInput
};
