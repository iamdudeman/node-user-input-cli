const UserInputLoopBuilder = require('./src/UserInputLoopBuilder');

new UserInputLoopBuilder()
  .addQuitAction()
  .addHelpAction()
  .addConsoleAction(
    'test',
    'test action',
    () => console.log('testaroo')
  )
  .setActionPromptChoice('Action: ')
  .setChoiceNotHandledCallback(() => console.log('choice not handled'))
  .start();
