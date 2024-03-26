import { buttonVariants } from '@lectio/ui'
import { cn } from '@lectio/ui/lib/utils'

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    id: string | number
    title: string
  }[]
  activeId?: string | number
  onSelectionChange?: (id: string | number) => void
}

export function SidebarNav({
  className,
  onSelectionChange,
  activeId,
  items,
  ...props
}: SidebarNavProps) {
  return (
    <nav
      className={cn(
        'flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1',
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelectionChange?.(item.id)}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            activeId === item.id
              ? 'bg-muted hover:bg-muted'
              : 'hover:bg-transparent hover:underline',
            'justify-start'
          )}
        >
          {item.title}
        </button>
      ))}
    </nav>
  )
}
