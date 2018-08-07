const UserInputLoopBuilder = require('./src/UserInputLoopBuilder');

new UserInputLoopBuilder()
  .addConsoleAction(
    'test',
    'test action',
    () => console.log('testaroo')
  )
  .setActionPromptChoice('Action: ')
  .setHelpId()
  .setQuitActionId('quit')
  .setChoiceNotHandledCallback(() => console.log('choice not handled'))
  .start();
