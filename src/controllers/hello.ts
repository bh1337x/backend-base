import { _ } from '../core/controller';
import { hello as validations } from '../validations';

const helloWorld = _(async (request, response) => {
  response.send({ message: 'Hello World!' });
}, validations.helloWorld);

const helloUser = _(async (request, response) => {
  request.logger.info('Hello User');
  response.send({ message: `Hello ${request.params.name}!` });
}, validations.helloUser);

export default {
  helloWorld,
  helloUser,
};
