import { useFormFields } from '@payloadcms/ui'
import { useEffect } from 'react'  

const buildDependentFieldUpdater = (path, dependencies, fn) => {
  // Returns an empty do-nothing component which does however take care of the updating
  return () => {
    const [object, dispatch] = useFormFields(([fields, dispatch]) => [
      Object.fromEntries([...dependencies, path].map(k => [k, fields[k]?.value])),
      dispatch,
    ])

    useEffect(() => {
      if (object && fn) {
        const newValue = fn(object, dispatch)
        if (newValue !== object[path]) dispatch({ type: 'UPDATE', path, value: newValue })
      }
    }, [dispatch, object])

    return null
  }
}

export default buildDependentFieldUpdater
