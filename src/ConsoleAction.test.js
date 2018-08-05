const assert = require('chai').assert;
const sinon = require('sinon');

const ConsoleAction = require('./ConsoleAction');

describe('ConsoleAction', () => {
  it('should be able to get id', () => {
    let expectedId = 'test';
    let consoleAction = new ConsoleAction(expectedId);

    assert.equal(consoleAction.getId(), expectedId);
  });

  it('should be able to get help text', () => {
    let expectedHelpText = 'help text';
    let consoleAction = new ConsoleAction(null, expectedHelpText);

    assert.equal(consoleAction.getHelpText(), expectedHelpText);
  });

  it('should be able to call action with arguments', () => {
    let expectedAction = sinon.stub();
    let expectedArguments = ['test', 'test2', 'test3'];
    let consoleAction = new ConsoleAction(null, null, expectedAction);

    consoleAction.callAction(...expectedArguments);

    assert.ok(expectedAction.calledWith(...expectedArguments));
  });
});
