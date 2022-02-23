import { HttpError } from './HttpError'
import { ResponseMeta } from './ResponseMeta'
import { StatusCode } from './StatusCode'

export type HttpResponse = {
  status?: StatusCode
  error?: HttpError
  data?: {
    error?: HttpError
  };
  meta?: ResponseMeta
}
