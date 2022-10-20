import { useColorModeValue } from "@chakra-ui/react";
import { memo, SVGProps } from "react";

const SparkleIcon = ({ fill, ...props }: SVGProps<SVGSVGElement>) => {
  const defaultFill = useColorModeValue("#000000", "#F2F2F2");

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter="url(#filter0_d_2_829)">
        <path
          d="M7.91543 16C7.88161 10.582 5.22622 8.00847 0 7.94074C6.57928 6.46772 6.83298 6.23069 7.98309 9.53674e-07C8.06765 5.19788 10.6723 7.78836 16 7.82222C10.6723 7.99153 7.94926 10.5651 7.91543 16V16Z"
          fill={fill ?? defaultFill}
        />
      </g>
      <defs>
        <filter
          id="filter0_d_2_829"
          x="-4"
          y="0"
          width="24"
          height="24"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_2_829"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_2_829"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default memo(SparkleIcon);
