import { Role } from '../Role/Role'
import { Uuid } from '../DataType/Uuid'

export type ResponseMeta = {
  auth: {
    userUuid?: Uuid
    roles?: Role[]
  }
}
