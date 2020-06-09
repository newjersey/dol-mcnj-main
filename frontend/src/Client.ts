export interface Client {
  getPrograms: (observer: Observer<string[]>) => void;
}

export interface Observer<T> {
  onSuccess: (result: T) => void;
  onError: () => void;
}
