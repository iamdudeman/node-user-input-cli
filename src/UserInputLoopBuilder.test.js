const assert = require('chai').assert;
const sinon = require('sinon');

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

  describe('addQuitAction', () => {
    it('should add the quit action');

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

  describe('start', () => {
    it('todo other tests');

    it('should not return the builder', () => {
      let builder = new UserInputLoopBuilder();

      builder.hasHelpAction = true;
      builder.hasQuitAction = true;

      assert.notEqual(builder.start(), builder);
    });
  });
});
