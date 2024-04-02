class Observer {
  isUnsubscribed: boolean;
  handlers: ObserverHandlers;
  _unsubscribe: UnsubscribeFunction;

  constructor(handlers: ObserverHandlers) {
    this.handlers = handlers;
    this.isUnsubscribed = false;
  }

  next: NextHandler = (value) => {
    if (this.handlers.next && !this.isUnsubscribed) {
      return this.handlers.next(value);
    }
    return {status: 0}
  }

  error: ErrorHandler = (error) => {
    if (!this.isUnsubscribed) {
      if (this.handlers.error) {
        return this.handlers.error(error);
      }

      this.unsubscribe();
    }
    return {status: 0}
  }

  complete: CompleteHandler = () => {
    if (!this.isUnsubscribed) {
      if (this.handlers.complete) {
        this.handlers.complete();
      }

      this.unsubscribe();
    }
  }

  unsubscribe: UnsubscribeFunction = () => {
    this.isUnsubscribed = true;

    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }
}

class Observable {
  _subscribe: SubscribeFunction;

  constructor(subscribe: SubscribeFunction) {
    this._subscribe = subscribe;
  }

  static from(values: RequestObject[]) {
    return new Observable((observer: Observer) => {
      values.forEach((value) => observer.next(value));

      observer.complete();

      return () => {
        console.log('unsubscribed');
      };
    });
  }

  subscribe(obs: ObserverHandlers) {
    const observer = new Observer(obs);

    observer._unsubscribe = this._subscribe(observer);

    return ({
      unsubscribe() {
        observer.unsubscribe();
      }
    });
  }
}

const userMock: User = {
  name: 'User Name',
  age: 26,
  roles: [
    'user',
    'admin'
  ],
  createdAt: new Date(),
  isDeleated: false,
};

const requestsMock: RequestObject[] = [
  {
    method: HTTP_POST_METHOD,
    host: 'service.example',
    path: 'user',
    body: userMock,
    params: {},
  },
  {
    method: HTTP_GET_METHOD,
    host: 'service.example',
    path: 'user',
    params: {
      id: '3f5h67s4s'
    },
  }
];

const handleRequest: NextHandler = (request) => {
  // handling of request
  return {status: HTTP_STATUS_OK};
};
const handleError: ErrorHandler = (error) => {
  // handling of error
  return {status: HTTP_STATUS_INTERNAL_SERVER_ERROR};
};

const handleComplete: CompleteHandler = () => console.log('complete');

const requests$ = Observable.from(requestsMock);

const subscription = requests$.subscribe({
  next: handleRequest,
  error: handleError,
  complete: handleComplete
});

subscription.unsubscribe();
