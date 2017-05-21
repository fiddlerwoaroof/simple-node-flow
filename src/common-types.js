//@flow

interface Request {
  url: string
};

type Headers = {[string]:string};
type Response = [number, Headers, string];

export type {Request,Headers,Response};
