declare module 'post-robot' {
  interface PostRobotEvent<T = unknown> {
    data: T;
  }

  interface PostRobotCancellable {
    cancel: () => void;
  }

  interface PostRobot {
    on<T = unknown>(
      event: string,
      handler: (event: PostRobotEvent<T>) => unknown
    ): PostRobotCancellable;
    send(window: Window | null, event: string, data?: unknown): Promise<unknown>;
  }

  const postRobot: PostRobot;
  export default postRobot;
}
