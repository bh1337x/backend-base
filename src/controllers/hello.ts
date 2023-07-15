import EventEmitter from 'events';
import { _ } from '../core/controller';
import logger from '../core/logger';
import { hello as validations } from '../validations';

const ee = new EventEmitter();

ee.on('message', (message: string) => {
  logger.info(message);
});

ee.on('ola', (message: string) => {
  logger.warn(message);
});

const helloWorld = _(async (req, res) => {
  ee.emit('message', 'Hello World');
  ee.emit('ola', 'THis is a test');
  res.send({ message: 'Hello World!' });
}, validations.helloWorld);

const helloUser = _(async (req, res) => {
  req.logger.info('Hello User');
  res.send({ message: `Hello ${req.params.name}!` });
}, validations.helloUser);

export default {
  helloWorld,
  helloUser,
};
