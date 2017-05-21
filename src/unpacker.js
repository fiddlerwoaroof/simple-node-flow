// @flow

let {parse} = require('url');

import type {Request} from './common-types';

interface Unpacker {
  unpack(request: Request): [string,string],
}

interface UnpackerProto extends Unpacker {
  defaultPath: string,
  defaultTarget: string,
}


interface TargetedQS {
  target: string
}

interface ParsedUrl {
  query?: void|TargetedQS,
  pathname?: void|string,
}

declare class RequestUnpacker {
  static (defaultTarget?: string,defaultPath?: string): RequestUnpacker,
  static prototype: UnpackerProto;

  constructor(defaultTarget?: string,defaultPath?: string): RequestUnpacker,
  defaultPath: string,
  defaultTarget: string,
  unpack(request: Request): [string,string],
}

function RequestUnpacker(defaultTarget : string ='No One', defaultPath : string = 'No Path') {
  if (! (this instanceof RequestUnpacker) ) {
    return new RequestUnpacker(defaultTarget, defaultPath);
  } else {
    // Do instance-specific stuff here...
    Object.assign(this, {defaultPath, defaultTarget});
  }
}
RequestUnpacker.prototype = {
  defaultPath: '<>',
  defaultTarget: '<>',

  unpack({url:reqUrl} : Request) : [string,string] {
    let {defaultPath,defaultTarget} : RequestUnpacker = this;
    let {
      pathname=defaultPath,
      query:{
        target = defaultTarget
      } = {target: defaultTarget}
    } : ParsedUrl = parse(reqUrl,true);
    return [pathname,target];
  }
}

module.exports = {RequestUnpacker};
export type {Unpacker};
