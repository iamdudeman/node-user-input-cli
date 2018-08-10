const UserInputLoopBuilder = require('./src/UserInputLoopBuilder');

new UserInputLoopBuilder()
  .addQuitAction()
  .addHelpAction()
  .addConsoleAction(
    'test',
    'test action',
    () => console.log('testaroo')
  )
  .setActionPromptText('Action: ')
  .setChoiceNotHandledCallback(() => console.log('choice not handled'))
  .start();
