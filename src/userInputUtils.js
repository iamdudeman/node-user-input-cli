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

module.exports = {
  handleChoice,
  promptUserInput
};
