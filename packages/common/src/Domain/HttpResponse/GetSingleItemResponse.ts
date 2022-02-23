import { RawPayload } from '../Item/RawPayload'
import { MinimalHttpResponse } from './MinimalHttpResponse'

export type GetSingleItemResponse = MinimalHttpResponse & {
  data: {
    success: true
    item: RawPayload
  } | {
    success: false
    message: string
  };
};
