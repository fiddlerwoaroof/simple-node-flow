// @flow

let http = require('http');

import type {Unpacker} from './unpacker';
import type {Request,Headers,Response} from './common-types';

let {RequestUnpacker} = require('./unpacker');
let {Dispatcher,OK} = require('./dispatcher');

function wiring() {
  let requestUnpacker = RequestUnpacker();
  let dispatcher = Dispatcher(requestUnpacker);
  return (req : Request,res) => {
    let [status, headers, content] = dispatcher.dispatch(req);
    res.writeHead(status, headers);
    res.end(content);
  }
}

console.log('Starting server . . .');
http.createServer(wiring()).listen(9405);
