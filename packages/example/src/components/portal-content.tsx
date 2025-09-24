import { useEffect } from 'react'

interface PortalContentProps {
  position: string
}

function PortalContent({ position }: PortalContentProps) {
  useEffect(() => {
    console.log(`✅ ${position} Portal useEffect mounted`)
    return () => {
      console.log(`❌ ${position} Portal useEffect unmounted`)
    }
  }, [position])

  const getContentText = () => {
    switch (position) {
      case 'append':
        return 'Appended Content (inside target, at end)'
      case 'prepend':
        return 'Prepended Content (inside target, at beginning)'
      case 'before':
        return 'Before Content (sibling, before target)'
      case 'after':
        return 'After Content (sibling, after target)'
      default:
        return `${position} Content`
    }
  }

  return <div className={`portal-content ${position}`}>{getContentText()}</div>
}

export default PortalContent
