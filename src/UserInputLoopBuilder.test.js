const assert = require('chai').assert;
const sinon = require('sinon');
const userInputUtils = require('./userInputUtils');

const UserInputLoopBuilder = require('./UserInputLoopBuilder');

describe('UserInputLoopBuilder', () => {
  let sandbox = sinon.createSandbox();
  let builder;

  beforeEach(() => {
    builder = new UserInputLoopBuilder();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('addConsoleAction', () => {
    it('should throw error if id is already added', () => {
      assert.throws(() => builder.addConsoleAction('test').addConsoleAction('test'), Error);
    });

    it('should add the console action', () => {
      let expectedId = 'test';
      let expectedHelp = 'help';
      let expectedAction = sandbox.stub();

      builder.addConsoleAction(expectedId, expectedHelp, expectedAction);

      builder.consoleActions[0].callAction();

      assert.ok(expectedAction.called);
      assert.equal(builder.consoleActions[0].getId(), expectedId);
      assert.equal(builder.consoleActions[0].getHelpText(), expectedHelp);
    });

    it('should return the builder', () => {
      assert.equal(builder.addConsoleAction(), builder);
    });
  });

  describe('addHelpAction', () => {
    it('should add the help action', () => {
      sandbox.stub(builder, 'addConsoleAction');

      builder.addHelpAction();
      assert.ok(builder.addConsoleAction.calledWith('help', ''));
    });

    it('should throw error if help action already added', () => {
      assert.throws(() => builder.addHelpAction().addHelpAction(), Error);
    });

    it('should be able to change help id', ()  => {
      const expectedId = 'testId';

      sandbox.stub(builder, 'addConsoleAction');

      builder.addHelpAction(expectedId);
      assert.ok(builder.addConsoleAction.calledWith(expectedId, ''));
    });

    it('should not console log help for help action', () => {
      sandbox.stub(builder, 'addConsoleAction');
      sandbox.stub(console, 'log');

      builder.addHelpAction();
      builder.addConsoleAction.args[0][2]();

      assert.notOk(console.log.called);
    });

    it('should console log help for actions when called', () => {
      sandbox.stub(builder, 'addConsoleAction');
      sandbox.stub(console, 'log');

      builder.consoleActions = [{
        getId: () => 'test',
        getHelpText: () => 'test2'
      }];
      builder.addHelpAction();
      builder.addConsoleAction.args[0][2]();

      assert.ok(console.log.calledWith('test: test2'));
    });

    it('should be able to change the help format', () => {
      sandbox.stub(builder, 'addConsoleAction');
      sandbox.stub(console, 'log');

      builder.consoleActions = [{
        getId: () => 'test',
        getHelpText: () => 'test2'
      }];
      builder.addHelpAction('help', '[HELP]-[ID]');
      builder.addConsoleAction.args[0][2]();

      assert.ok(console.log.calledWith('test2-test'));
    });

    it('should return the builder', () => {
      assert.equal(builder.addHelpAction(), builder);
    });
  });

  describe('addQuitAction', () => {
    it('should add the quit action', () => {
      sandbox.stub(builder, 'addConsoleAction');

      builder.addQuitAction();
      assert.ok(builder.addConsoleAction.calledWith('quit', 'ends the program', process.exit));
    });

    it('should throw error if quit action already added', () => {
      assert.throws(() => builder.addQuitAction().addQuitAction(), Error);
    });

    it('should be able to change quit id and help text', ()  => {
      const expectedId = 'testId';
      const expectedHelpText = 'testHelp';

      sandbox.stub(builder, 'addConsoleAction');

      builder.addQuitAction(expectedId, expectedHelpText);
      assert.ok(builder.addConsoleAction.calledWith(expectedId, expectedHelpText, process.exit));
    });

    it('should return the builder', () => {
      assert.equal(builder.addQuitAction(), builder);
    });
  });

  describe('setActionPromptText', () => {
    it('should set the action prompt choice', () => {
      let expectedText = 'test';

      builder.setActionPromptText(expectedText);

      assert.equal(builder.actionPromptText, expectedText);
    });

    it('should throw an error if a string is not passed', () => {
      assert.throws(() => new UserInputLoopBuilder().setActionPromptText(), Error);
    });

    it('should return the builder', () => {
      assert.equal(builder.setActionPromptText('test'), builder);
    });
  });

  describe('setChoiceNotHandledCallback', () => {
    it('should set the choice not handled callback', () => {
      let expectedCallback = sandbox.stub();

      builder.setChoiceNotHandledCallback(expectedCallback);

      assert.equal(builder.choiceNotHandledCallback, expectedCallback);
    });

    it('should throw an error if a string is not passed', () => {
      assert.throws(() => new UserInputLoopBuilder().setChoiceNotHandledCallback(), Error);
    });

    it('should return the builder', () => {
      assert.equal(builder.setChoiceNotHandledCallback(() => {}), builder);
    });
  });

  describe('processInput', () => {
    beforeEach(() => {
      sandbox.stub(userInputUtils, 'promptUserInput').returns(Promise.resolve());
      sandbox.stub(userInputUtils, 'handleChoice').returns(true);
      sandbox.stub(builder, 'start');

      builder.hasHelpAction = true;
      builder.hasQuitAction = true;
    });

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
    beforeEach(() => {
      sandbox.stub(userInputUtils, 'promptUserInput').returns(Promise.resolve());
      sandbox.stub(userInputUtils, 'handleChoice').returns(true);
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
