import { useEffect } from 'react' // eslint-disable-line no-unused-vars
import { useFormFields } from 'payload/components/forms'

const buildDependentFieldUpdater = (path, dependencies, fn) => {
  // Returns an empty do-nothing component which does however take care of the updating
  return () => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const [object, dispatch] = useFormFields(([fields, dispatch]) => [
      Object.fromEntries([...dependencies, path].map(k => [k, fields[k]?.value])),
      dispatch,
    ])

    useEffect(() => {
      if (object && fn) {
        const newValue = fn(object, dispatch)
        if (newValue !== object[path]) dispatch({ type: 'UPDATE', path, value: newValue })
      }
    }, [object])

    return null
  }
}

export default buildDependentFieldUpdater
