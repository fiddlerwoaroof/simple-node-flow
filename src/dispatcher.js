//@flow
import type {Unpacker} from './unpacker';
import type {Request,Headers,Response} from './common-types';

function OK(contentType: string, body: string, otherHeaders?: {[string]:string|number}) : Response {
  return [
    200,
    Object.assign({},
      otherHeaders,
      {'Content-Type': contentType}
    ),
    body
  ];
}

function Dispatcher(requestUnpacker : Unpacker) {
  if (! (this instanceof Dispatcher)) {
    return new Dispatcher(...arguments);
  } else {
    // Do instance-specific stuff here...
    this.requestUnpacker = requestUnpacker;
    return this;
  }
}
Dispatcher.prototype = {
  dispatch(request : Request) {
    let [pathname, target] = (this.requestUnpacker : Unpacker).unpack(request);
    let result = 'No Result...';

    switch (pathname) {
      case '/hello':
      result = `Hello, ${target}!`;

      break;

      case '/length':
      result = `${target.length}`;

      break;
    }

    return OK('text/plain', result);
  }
}

module.exports = {Dispatcher,OK}
