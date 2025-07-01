import { FieldHook, TypeWithID } from 'payload'

export const ensureGuid: FieldHook<TypeWithID, unknown, unknown> = ({ value }) => {
  if (typeof value !== 'string' || value.length !== 36) {
    return crypto.randomUUID()
  }

  return value
}
