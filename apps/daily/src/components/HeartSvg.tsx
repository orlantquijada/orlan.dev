import type { ComponentProps } from "react";

export default function HeartSvg(props: ComponentProps<"svg">) {
  return (
    <svg
      fill="none"
      height="32"
      viewBox="0 0 32 32"
      width="32"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Heart</title>
      <path
        d="M21.008 5.162c-2.84.509-5.011 3.905-5.011 3.905s-2.18-3.396-5.012-3.905c-7.012-1.25-9.903 4.993-8.732 9.64 1.73 6.863 10.053 13.014 12.834 14.916.55.376 1.27.376 1.83 0 2.791-1.902 11.113-8.053 12.834-14.916 1.16-4.647-1.73-10.89-8.743-9.64z"
        fill="currentColor"
      />
    </svg>
  );
}
