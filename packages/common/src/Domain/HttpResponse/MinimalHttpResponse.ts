import { HttpError } from './HttpError'
import { StatusCode } from './StatusCode'

export type MinimalHttpResponse = {
  status?: StatusCode
  error?: HttpError
}
