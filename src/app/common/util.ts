import {Observable} from "rxjs";

export function createHttpObservable(url: string) {
  return new Observable(observer => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        observer.next(data);
        observer.complete();
      })
      .catch(error => observer.error(error));
  });
}
