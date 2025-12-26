declare module 'post-robot' {
  interface Event<T = unknown> {
    source: Window;
    origin: string;
    data: T;
  }

  interface Listener {
    cancel: () => void;
  }

  interface Response<T = unknown> {
    data: T;
  }

  export function send<T = unknown>(
    window: Window,
    messageName: string,
    data?: unknown
  ): Promise<Response<T>>;

  export function on<T = unknown>(
    messageName: string,
    handler: (event: Event<T>) => unknown
  ): Listener;

  const postRobot: {
    send: typeof send;
    on: typeof on;
  };

  export default postRobot;
}
