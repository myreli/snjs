import { GetSingleItemResponse, HttpResponse, Uuid } from '@standardnotes/common'

export interface ItemApiInterface {
  getSingleItem(itemUuid: Uuid): Promise<GetSingleItemResponse | HttpResponse>
}
