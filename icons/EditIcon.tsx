import { memo, SVGProps } from "react";

const EditIcon = ({ fill, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 19 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.3087 0.29L18.6487 2.63C19.0387 3.02 19.0387 3.65 18.6487 4.04L16.8187 5.87L13.0687 2.12L14.8987 0.29C15.0887 0.1 15.3387 0 15.5987 0C15.8587 0 16.1087 0.09 16.3087 0.29ZM0.93869 14.25V18H4.68869L15.7487 6.94L11.9987 3.19L0.93869 14.25ZM3.85869 16H2.93869V15.08L11.9987 6.02L12.9187 6.94L3.85869 16Z"
      fill={fill}
    />
  </svg>
);

export default memo(EditIcon);
