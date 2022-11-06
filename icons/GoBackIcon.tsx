import { memo, SVGProps } from "react";

const GoBackIcon = ({ fill, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 19 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M26.6667 14.6667H10.44L17.8933 7.21334L16 5.33334L5.33334 16L16 26.6667L17.88 24.7867L10.44 17.3333H26.6667V14.6667Z"
      fill={fill ?? "#F2F2F2"}
    />
  </svg>
);

export default memo(GoBackIcon);
