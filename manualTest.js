const UserInputLoop = require('./src/UserInputLoop');

let loop = new UserInputLoop();

loop.addConsoleAction(
  'test',
  'test action',
  () => console.log('testaroo')
);

loop.start();
