const assert = require('chai').assert;
const sinon = require('sinon');
const readline = require('readline');

const userInputUtils = require('./userInputUtils');

describe('userInputUtils', () => {
  describe('promptUserInput', () => {
    let sandbox, mockReadLine, expectedChoice;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
      mockReadLine = {
        question: (question, callback) => {
          callback(expectedChoice);
        },
        close: sandbox.stub()
      };

      sandbox.stub(readline, 'createInterface').returns(mockReadLine);
    });

    afterEach(() => {
      sandbox.restore();
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
    it('todo test');
  });
});
