import { Observable } from 'rxjs'
export const toPromise = <T>(fn: Observable<T>) => {
  return new Promise((resolve) => {
    fn.subscribe({
      next(value) {
        return resolve(value)
      },
    })
  })
}
