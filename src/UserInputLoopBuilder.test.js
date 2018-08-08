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

  describe('setActionPromptChoice', () => {
    it('should set the action prompt choice');

    it('should return the builder');
  });

  describe('setChoiceNotHandledCallback', () => {
    it('should set the choice not handled callback');

    it('should return the builder');
  });

  describe('start', () => {


    it('should not return the builder');
  });
});
