/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContentReference } from './ContentReference'

export type PayloadContent = {
  [key: string]: any
  references: ContentReference[]
}
