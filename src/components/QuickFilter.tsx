import React from 'react'

interface QuickFilterProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  className?: string
}

export function QuickFilter({ placeholder = 'Quick filter...', value, onChange, className }: QuickFilterProps) {
  return (
    <div className={className}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border rounded px-3 py-2"
      />
    </div>
  )
}


