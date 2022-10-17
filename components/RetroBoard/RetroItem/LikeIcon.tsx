import { memo, SVGProps } from "react";
const LikeSvgIcon = ({ fill, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    width={15}
    height={14}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.424 13.922h5.728c.528 0 .98-.33 1.17-.804l1.922-4.645c.058-.151.09-.31.09-.48V6.674c0-.725-.573-1.318-1.273-1.318H9.045l.605-3.011.019-.21c0-.27-.108-.521-.28-.7l-.675-.69-4.193 4.34c-.23.238-.37.567-.37.93v6.588c0 .725.573 1.318 1.273 1.318Zm0-7.906 2.762-2.86-.853 3.519h5.728v1.317l-1.91 4.612H5.425V6.016Zm-2.545 0H.333v7.906H2.88V6.016Z"
      fill={fill}
    />
  </svg>
);

export default memo(LikeSvgIcon);
