import { RefObject, useEffect, useMemo, useState } from "react";

export default function useOnScreen(ref: RefObject<HTMLElement | null>) {

    const [isIntersecting, setIntersecting] = useState(false)
  
    const observer = useMemo(() => new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), [ref])
  
  
    useEffect(() => {
      if(ref !== null && ref.current != null)
      {
        observer.observe(ref.current)
        return () => observer.disconnect()
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  
    return isIntersecting
  }