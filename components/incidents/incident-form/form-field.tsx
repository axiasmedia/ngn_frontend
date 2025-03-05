import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface FormFieldProps {
  id: string
  label: string
  placeholder: string
  type?: string
  isTextarea?: boolean
  accept?: string
}

export function FormField({ id, label, placeholder, type = "text", isTextarea = false, accept }: FormFieldProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
      )}
      {isTextarea ? (
        <Textarea id={id} placeholder={placeholder} className="min-h-[100px]" />
      ) : (
        <Input id={id} type={type} placeholder={placeholder} accept={accept} className="w-full" />
      )}
    </div>
  )
}

