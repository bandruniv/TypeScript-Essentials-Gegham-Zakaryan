type Role = 'user' | 'admin'

type User = {
  name: string,
  age: number,
  roles: Role[],
  createdAt: Date,
  isDeleated: boolean,
}

type RequestObject = {
  method: typeof HTTP_GET_METHOD | typeof HTTP_POST_METHOD,
  host: string,
  path: string,
  body?: User,
  params?: {[key:string]: string},
}

type ResponseObject = {
  status: typeof HTTP_STATUS_OK | typeof HTTP_STATUS_INTERNAL_SERVER_ERROR | 0;
}

type NextHandler = (request: RequestObject) => ResponseObject
type ErrorHandler = (error: Error) => ResponseObject
type CompleteHandler = () => void

type ObserverHandlers = {
  next: NextHandler,
  error: ErrorHandler,
  complete: CompleteHandler
}

type SubscribeFunction = (observer: Observer) => CompleteHandler;
type UnsubscribeFunction = () => void;