import React from "react"

const TextInput = ({
  platform,
  label,
  isTextArea,
  initialValue,
  placeholder,
  onUpdate,
}: {
  platform?: string
  label?: string
  placeholder: string
  initialValue?: string
  isTextArea?: boolean
  onUpdate: (fieldName?: string, value?: string) => void
}) => {
  const onChange = (e: any) => {
    onUpdate(label?.toLowerCase(), e.target.value)
  }
  return (
    <div className="flex flex-col w-full items-start py-1">
      <label className="block text-black font-bold mb-2 text-xl pr-4 md:w-4/5">
        {platform ? platform + " " + label : label}
      </label>
      <div className="bg-white md:w-4/5 mb-1 rounded border-black border-[1px]">
        {isTextArea ? (
          <textarea
            id={label?.toUpperCase()}
            value={initialValue || ""}
            onChange={onChange}
            rows={4}
            placeholder={placeholder}
            className="rounded w-full py-2 px-4 appeance-none"
          />
        ) : (
          <input
            id={label?.toLowerCase()}
            onChange={onChange}
            value={initialValue || ""}
            placeholder={placeholder}
            className="appeance-none rounded outline-none w-[95%] py-2 px-4 text-black"
          />
        )}
      </div>
    </div>
  )
}

export default TextInput
