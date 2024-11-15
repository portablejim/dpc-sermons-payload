import { FieldHook } from 'payload'

export const ensureGuid: FieldHook<any, any, any> = ({ value }) => {
  if (typeof value !== 'string' || value.length !== 36) {
    return crypto.randomUUID()
  }

  return value
}
