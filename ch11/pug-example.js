/* Must do npm install pug */
const pug = require('pug');
const template = pug.compileFile('./demo.pug');

const model = {
  title: 'Web Dev', 
  areYouUsingPug: true
}
const html = template(model);
