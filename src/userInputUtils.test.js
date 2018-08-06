const assert = require('chai').assert;
const sinon = require('sinon');
const readline = require('readline');

const userInputUtils = require('./userInputUtils');

describe('userInputUtils', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('promptUserInput', () => {
    let mockReadLine, expectedChoice;

    beforeEach(() => {
      mockReadLine = {
        question: (question, callback) => {
          callback(expectedChoice);
        },
        close: sandbox.stub()
      };

      sandbox.stub(readline, 'createInterface').returns(mockReadLine);
    });

    it('should resolve with the user\'s choice', () => {
      expectedChoice = 'test';

      return userInputUtils.promptUserInput('question')
        .then(result => assert.equal(result, expectedChoice));
    });

    it('should close the readline', () => {
      return userInputUtils.promptUserInput()
        .then(() => assert.ok(mockReadLine.close.called));
    });
  });

  describe('handleChoice', () => {
    it('should call action if can process input', () => {
      let action = {
        id: 'test',
        callAction: sandbox.stub()
      };

      userInputUtils.handleChoice('test', [action]);

      assert.ok(action.callAction.called);
    });

    it('should return true if input was handled', () => {
      let action = {
        id: 'test',
        callAction: sandbox.stub()
      };

      assert.ok(userInputUtils.handleChoice('test', [action]));
    });

    it('should return false if process was not handled', () => {
      assert.notOk(userInputUtils.handleChoice('test', []));
    });
  });
});
