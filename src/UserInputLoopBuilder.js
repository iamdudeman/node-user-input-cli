const ConsoleAction = require('./ConsoleAction');
const userInputUtils = require('./userInputUtils');

/**
 * Builder used to customize a user input loop before starting it.
 */
class UserInputLoopBuilder {
  /**
   * Inialize a builder instance.
   */
  constructor() {
    this.actionPromptText = 'Action: ';
    this.choiceNotHandledCallback = () => {};
    this.consoleActions = [];
    this.hasHelpAction = false;
    this.hasQuitAction = false;
  }

  /**
   * Adds a ConsoleAction that can be executed by a user.
   *
   * @param {string} id - The id of the console action
   * @param {string} helpText - The help text for the action
   * @param {function} action - The action
   * @return {UserInputLoopBuilder} The builder
   */
  addConsoleAction(id, helpText, action) {
    if (this.consoleActions.some(action => action.getId() == id)) {
      throw Error('Cannot reuse Action id ' + id);
    }

    this.consoleActions.push(new ConsoleAction(id, helpText, action));
    return this;
  }

  // TODO figure out this implementation and test
  addHelpAction() {
    this.hasHelpAction = true;
    return this.addConsoleAction('help', '', () => {
      this.consoleActions.forEach(action => {
        if (action.getId() != 'help') {
          console.log(action.getId() + ':', action.getHelpText());
        }
      });
    });
  }

  /**
   * Adds an action that will end the program.
   *
   * @param {string} [id=quit] - The id for the quit action
   * @param {string} [helpText=ends the program] - The help text for the quit action
   * @return {UserInputLoopBuilder} The builder
   */
  addQuitAction(id = 'quit', helpText = 'ends the program') {
    this.hasQuitAction = true;
    return this.addConsoleAction(id, helpText, process.exit);
  }

  /**
   * Set the text for the user prompt.
   *
   * @param {string} actionPromptText - The text for the user prompt
   * @return {UserInputLoopBuilder} The builder
   */
  setActionPromptText(actionPromptText) {
    if (typeof actionPromptText != 'string') {
      throw Error('action prompt choice must be a string');
    }

    this.actionPromptText = actionPromptText;
    return this;
  }

  /**
   * Sets the handler for when a user choice was not handled by an action.
   *
   * @param {function} choiceNotHandledCallback - The callback for if user input was not handled
   * @return {UserInputLoopBuilder} The builder
   */
  setChoiceNotHandledCallback(choiceNotHandledCallback) {
    if (typeof choiceNotHandledCallback != 'function') {
      throw Error('choice not handled callback must be a function');
    }

    this.choiceNotHandledCallback = choiceNotHandledCallback;
    return this;
  }

  /**
   * Processes the user's input by handling their choice by registered actions or by the choice not handled callback.
   *
   * @param {string} input - The user's input
   */
  processInput(input) {
    let isChoiceHandled = userInputUtils.handleChoice(input, this.consoleActions);

    if (!isChoiceHandled) {
      this.choiceNotHandledCallback && this.choiceNotHandledCallback();
    }

    // Recursive so it loops
    this.start();
  }

  /**
   * Starts the user input loop.
   */
  start() {
    if (!this.hasHelpAction) {
      throw Error('must have a help action');
    }

    if (!this.hasQuitAction) {
      throw Error('must have a quit action');
    }

    return userInputUtils.promptUserInput(this.actionPromptText).then(this.processInput);
  }
}

module.exports = UserInputLoopBuilder;
