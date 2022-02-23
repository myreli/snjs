import { Role, Uuid } from '@standardnotes/common'

export type CrossServiceTokenData = {
  user: {
    uuid: Uuid,
    email: string
  },
  roles: Array<Role>,
  session?: {
    uuid: Uuid,
    api_version: string,
    created_at: string,
    updated_at: string,
    device_info: string
  },
  extensionKey?: string,
}
