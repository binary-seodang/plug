import { Observable } from 'rxjs'

export interface SFU {
  Call(param: any): Observable<any>
}
