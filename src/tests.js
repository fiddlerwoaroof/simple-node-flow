// @flow

let http = require('http');

import type {Unpacker} from './unpacker';
import type {Request,Headers,Response} from './common-types';

let {RequestUnpacker} = require('./unpacker');
let {Dispatcher,OK} = require('./dispatcher');

type AssertionFunc<T1,T2:T1> = (T1,T2) => bool;
type Assertion<T> = [string, T, AssertionFunc<T,T>, T];
function runAssertions(title : string, ...assertions: Array<Assertion<*>>) {
  console.log(title);
  for (let [assertTitle, expected, cmp, actual]  of assertions) {
    let result : string = 'FAIL'
    try {
      if (cmp(expected, actual)) {
        result = 'PASS';
      } else {
        result += `: expected ${JSON.stringify(expected)} got ${JSON.stringify(actual)}`;
      }
    } catch (e) {
      result = `ERROR ${e}`;
    }
    console.log(`  ${assertTitle}: ${result}`)
  }
  console.log();
}
let eql : AssertionFunc<*,*> = (a, b) => a === b;


(() => {
  // given
  let contentType = 'text/plain';
  let body = 'the body';
  let someHeaderValue = 'the value';

  // when
  let [actualStatus, {"Content-Type":actualContentType, someHeader}, actualBody] =
    OK(contentType, body, {someHeader: someHeaderValue})

  // then
  runAssertions('OK returns expected values:',
    ['        body', body, eql, actualBody],
    ['content-type', contentType, eql, actualContentType],
    ['      header', someHeaderValue, eql, someHeader],
    ['      status', 200, eql, actualStatus],
  );
})();


(() => {
  // given
  let contentType = 'text/plain';
  let body = 'the body';
  let someHeaderValue = 'the value';

  // when
  let [actualStatus, {"Content-Type":actualContentType, someHeader}, actualBody] =
    OK(contentType, body, {'Content-Type': 'application/foo', someHeader: someHeaderValue})

  // then
  runAssertions('OK contentType overrides other headers:',
    ['content-type', contentType, eql, actualContentType],
    ['      header', someHeaderValue, eql, someHeader],
  );
})();

(() => {
  // given
  let requestUnpacker = RequestUnpacker();
  let request : Request = {url: '/bob?target=baz'};

  // when
  let [pathname, target] = requestUnpacker.unpack((request : Request))

  // then
  runAssertions('RequestUnpacker target passed test: ',
    ['        body', 'baz', eql, target],
    ['    pathname', '/bob', eql, pathname],
  );
})();

(() => {
  // given
  let defaultTarget = 'foo'
  let requestUnpacker = RequestUnpacker('foo');
  let request : Request = {url: '/hello'};

  // when
  let [pathname, target] = requestUnpacker.unpack((request : Request))

  // then
  runAssertions('RequestUnpacker default target test: ',
    ['        body', defaultTarget, eql, target],
    ['    pathname', '/hello', eql, pathname],
  );
})();

(() => {
  // given
  let dispatcher = Dispatcher({ unpack(req) { return ['/hello', 'foo'] }});
  let request : Request = {url: 'ignored'};

  // when
  let [status, headers, actual] = dispatcher.dispatch((request : Request));

  // then
  runAssertions('Hello Route test: ',
    ['      status', 200, eql, status],
    ['     headers', 'text/plain', eql, headers['Content-Type']],
    ['        body', 'Hello, foo!', eql, actual],
  );
})();

(() => {
  // given
  let dispatcher = Dispatcher({ unpack(req) { return ['/length', 'foo'] }});
  let fakeReq : Request = {url: 'ignored'};

  // when
  let [status, headers, actual] = dispatcher.dispatch(fakeReq);

  // then
  runAssertions('Length Route test: ',
    ['      status', 200, eql, status],
    ['     headers', 'text/plain', eql, headers['Content-Type']],
    ['        body', '3', eql, actual],
  );
})();
