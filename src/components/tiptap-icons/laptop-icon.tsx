import { memo } from "react"

type SvgProps = React.ComponentPropsWithoutRef<"svg">

export const LaptopIcon = memo(({ className, ...props }: SvgProps) => {
  return (
    <svg
      width="24"
      height="24"
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 4H4C2.89543 4 2 4.89543 2 6V16C2 17.1046 2.89543 18 4 18H0V20H24V18H20C21.1046 18 22 17.1046 22 16V6C22 4.89543 21.1046 4 20 4ZM20 16H4V6H20V16Z"
        fill="currentColor"
      />
    </svg>
  )
})

LaptopIcon.displayName = "LaptopIcon"
