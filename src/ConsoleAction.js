/**
 * ConsoleAction is a data class that holds information needed to describe and perform an
 * action in the console.
 */
class ConsoleAction {
  /**
   * Create an instance of a ConsoleAction.
   *
   * @param {*} id - The id
   * @param {string} helpText - The help text
   * @param {function} action - The action
   */
  constructor(id, helpText, action) {
    this.id = id;
    this.helpText = helpText;
    this.action = action;
  }

  /**
   * Calls the action set by the constructor with any arguments passed to callAction.
   */
  callAction() {
    return this.action(...arguments);
  }

  /**
   * Returns the unique id for this ConsoleAction.
   * @returns {*} - The id
   */
  getId() {
    return this.id;
  }

  /**
   * Returns the help text.
   * @returns {string} - The help text
   */
  getHelpText() {
    return this.helpText;
  }
}

module.exports = ConsoleAction;
