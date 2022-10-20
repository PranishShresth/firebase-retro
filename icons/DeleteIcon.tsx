import { memo, SVGProps } from "react";

const DeleteIcon = ({ fill, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 15 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.4399 0H5.43994L4.43994 1H0.939941V3H14.9399V1H11.4399L10.4399 0ZM11.9399 6V16H3.93994V6H11.9399ZM1.93994 4H13.9399V16C13.9399 17.1 13.0399 18 11.9399 18H3.93994C2.83994 18 1.93994 17.1 1.93994 16V4Z"
      fill={fill}
    />
  </svg>
);

export default memo(DeleteIcon);
