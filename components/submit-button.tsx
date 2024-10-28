'use client'

import {forwardRef} from 'react'
import {Spinner} from '@/components/icons'
import {Button, ButtonProps} from '@/components/ui/button'
import {cn} from '@/lib/utils'
import {useFormStatus} from 'react-dom'

export type SubmitButtonProps = Omit<ButtonProps, 'type' | 'aria-disabled'>

const SubmitButton = forwardRef<HTMLButtonElement, SubmitButtonProps>(
  ({children, className, disabled, ...rest}, ref) => {
    const {pending} = useFormStatus()
    const isDisabled = disabled || pending

    return (
      <Button
        {...rest}
        disabled={isDisabled}
        type="submit"
        aria-disabled={isDisabled}
        ref={ref}
        className={cn('relative', className)}
      >
        {pending && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner className="h-4 w-4 animate-spin" />
          </div>
        )}
        <div className={cn(pending ? 'opacity-0' : 'contents')}>{children}</div>
      </Button>
    )
  },
)
SubmitButton.displayName = 'SubmitButton'

export {SubmitButton}
