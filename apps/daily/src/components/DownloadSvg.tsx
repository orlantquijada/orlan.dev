import type { ComponentProps } from "react";

export default function DownloadSvg(props: ComponentProps<"svg">) {
  return (
    <svg
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Download</title>
      <path
        d="M16 8.00002L16.5 8V8C17.8956 8 18.5934 8.00001 19.1612 8.17225C20.4396 8.56006 21.44 9.56046 21.8278 10.8389C22 11.4067 22 12.1044 22 13.5V15.6C22 17.8402 22 18.9603 21.564 19.816C21.1805 20.5686 20.5686 21.1805 19.816 21.564C18.9603 22 17.8402 22 15.6 22L8.4 22C6.15979 22 5.03968 22 4.18404 21.564C3.43139 21.1805 2.81947 20.5686 2.43597 19.816C2 18.9603 2 17.8402 2 15.6L2 13.5C2 12.1044 2 11.4067 2.17224 10.8389C2.56004 9.56046 3.56045 8.56005 4.83884 8.17225C5.40664 8.00001 6.10443 8 7.5 8V8L8 8.00002M12 2V17M12 17L16 13M12 17L8 13"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
