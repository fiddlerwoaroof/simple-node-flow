// @flow

let http = require('http');

import type {Unpacker} from './unpacker';
import type {Request,Headers,Response} from './common-types';

let {RequestUnpacker} = require('./unpacker');
let {Dispatcher} = require('./dispatcher');

function wiring() {
  let requestUnpacker : Unpacker = RequestUnpacker();
  let dispatcher : Dispatcher = Dispatcher(requestUnpacker);
  return (req : Request,res) => {
    let [status, headers, content] : Response = dispatcher.dispatch(req);
    res.writeHead(status, headers);
    res.end(content);
  }
}

console.log('Starting server . . .');
http.createServer(wiring()).listen(9405);
