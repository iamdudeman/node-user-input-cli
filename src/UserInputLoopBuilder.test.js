const assert = require('chai').assert;
const sinon = require('sinon');
const userInputUtils = require('./userInputUtils');

const UserInputLoopBuilder = require('./UserInputLoopBuilder');

describe('UserInputLoopBuilder', () => {
  let sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  describe('addConsoleAction', () => {
    it('should throw error if id is already added', () => {
      assert.throws(() => new UserInputLoopBuilder()
        .addConsoleAction('test')
        .addConsoleAction('test'), Error);
    });

    it('should add the console action', () => {
      let expectedId = 'test';
      let expectedHelp = 'help';
      let expectedAction = sandbox.stub();
      let builder = new UserInputLoopBuilder()
        .addConsoleAction(expectedId, expectedHelp, expectedAction);

      builder.consoleActions[0].callAction();

      assert.ok(expectedAction.called);
      assert.equal(builder.consoleActions[0].getId(), expectedId);
      assert.equal(builder.consoleActions[0].getHelpText(), expectedHelp);

    });

    it('should return the builder', () => {
      let builder = new UserInputLoopBuilder();

      assert.equal(builder.addConsoleAction(), builder);
    });
  });

  describe('addHelpAction', () => {
    it('todo implement and test');
  });

  describe('addQuitAction', () => {
    it('should add the quit action', () => {
      let builder = new UserInputLoopBuilder();

      sandbox.stub(builder, 'addConsoleAction');

      builder.addQuitAction();
      assert.ok(builder.addConsoleAction.calledWith('quit', 'ends the program', process.exit));
    });

    it('should be able to change quit id');

    it('should be able to change quit help text');

    it('should return the builder', () => {
      let builder = new UserInputLoopBuilder();

      assert.equal(builder.addQuitAction(), builder);
    });
  });

  describe('setActionPromptText', () => {
    it('should set the action prompt choice', () => {
      let expectedText = 'test';
      let builder = new UserInputLoopBuilder();

      builder.setActionPromptText(expectedText);

      assert.equal(builder.actionPromptText, expectedText);
    });

    it('should throw an error if a string is not passed', () => {
      assert.throws(() => new UserInputLoopBuilder().setActionPromptText(), Error);
    });

    it('should return the builder', () => {
      let builder = new UserInputLoopBuilder();

      assert.equal(builder.setActionPromptText('test'), builder);
    });
  });

  describe('setChoiceNotHandledCallback', () => {
    it('should set the choice not handled callback', () => {
      let expectedCallback = sandbox.stub();
      let builder = new UserInputLoopBuilder();

      builder.setChoiceNotHandledCallback(expectedCallback);

      assert.equal(builder.choiceNotHandledCallback, expectedCallback);
    });

    it('should throw an error if a string is not passed', () => {
      assert.throws(() => new UserInputLoopBuilder().setChoiceNotHandledCallback(), Error);
    });

    it('should return the builder', () => {
      let builder = new UserInputLoopBuilder();

      assert.equal(builder.setChoiceNotHandledCallback(() => {}), builder);
    });
  });

  describe('processInput', () => {
    let builder;

    beforeEach(() => {
      sandbox.stub(userInputUtils, 'promptUserInput').returns(Promise.resolve());
      sandbox.stub(userInputUtils, 'handleChoice').returns(true);

      builder = new UserInputLoopBuilder();

      sandbox.stub(builder, 'start');

      builder.hasHelpAction = true;
      builder.hasQuitAction = true;
    });

    /*
    let isChoiceHandled = userInputUtils.handleChoice(input, this.consoleActions);

    if (!isChoiceHandled) {
      this.choiceNotHandledCallback && this.choiceNotHandledCallback();
    }

    // Recursive so it loops
    this.start();
    */

    it('should handle choice', () => {
      const input = 'test';
      const consoleActions = [];

      builder.consoleActions = consoleActions;

      builder.processInput(input);

      assert.ok(userInputUtils.handleChoice.calledWith(input, consoleActions));
    });

    it('should call choice not handled callback if choice not handled', () => {
      builder.choiceNotHandledCallback = sandbox.stub();
      userInputUtils.handleChoice.returns(false);

      builder.processInput();

      assert.ok(builder.choiceNotHandledCallback.called);
    });

    it('should call start to be recursive', () => {
      builder.processInput();

      assert.ok(builder.start.called);
    });

    it('should not return the builder', () => {
      assert.notEqual(builder.processInput(), builder);
    });
  });

  describe('start', () => {
    let builder;

    beforeEach(() => {
      sandbox.stub(userInputUtils, 'promptUserInput').returns(Promise.resolve());
      sandbox.stub(userInputUtils, 'handleChoice').returns(true);

      builder = new UserInputLoopBuilder();

      sandbox.stub(builder, 'processInput');

      builder.hasHelpAction = true;
      builder.hasQuitAction = true;
    });

    it('should error if no help action defined', () => {
      builder.hasHelpAction = false;
      builder.hasQuitAction = true;

      assert.throws(() => builder.start(), Error);
    });

    it('should error if no help action defined', () => {
      builder.hasHelpAction = true;
      builder.hasQuitAction = false;

      assert.throws(() => builder.start(), Error);
    });

    it('should prompt for user input with prompt text', () => {
      const expectedHelpText = 'test';

      builder.actionPromptText = expectedHelpText;

      builder.start();

      assert.ok(userInputUtils.promptUserInput.calledWith(expectedHelpText));
    });

    it('should then process input', () => {
      const expectedInput = 'test';

      userInputUtils.promptUserInput.returns(Promise.resolve(expectedInput));

      return builder.start().then(() => {
        assert.ok(builder.processInput.calledWith(expectedInput));
      });
    });

    it('should not return the builder', () => {
      builder.hasHelpAction = true;
      builder.hasQuitAction = true;

      assert.notEqual(builder.start(), builder);
    });
  });
});
