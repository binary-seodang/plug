import { Observable } from "rxjs"
const toPromise = async <T>(fn: Observable<T>) => {
  return await new Promise((resolve, reject) => {
    try {
      fn.subscribe({
        next(value) {
          return resolve(value)
        },
      })
    } catch (err) {
      return reject(err)
    }
  })
}

export default toPromise
