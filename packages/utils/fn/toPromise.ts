import { Observable } from "rxjs"
const toPromise = async <T>(fn: Observable<T>) => {
  try {
    return await new Promise((resolve) => {
      fn.subscribe({
        next(value) {
          return resolve(value)
        },
      })
    })
  } catch (err) {
    console.error(err)
    return {}
  }
}

export default toPromise
