// expor t
import { memo, SVGProps } from "react";

const LogoIcon = ({ fill, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="256" cy="256" r="232" fill="#0D131A" />
    <g clipPath="url(#clip0_111_3613)">
      <g filter="url(#filter0_d_111_3613)">
        <path
          d="M254.414 105C253.78 206.587 203.992 254.841 106 256.111C229.362 283.73 234.118 288.175 255.683 405C257.268 307.54 306.106 258.968 406 258.333C306.106 255.159 255.049 206.905 254.414 105Z"
          fill="#CFFF18"
        />
      </g>
      <g clipPath="url(#clip1_111_3613)">
        <g filter="url(#filter1_d_111_3613)">
          <path
            d="M406.293 148.535C376.494 148.349 362.34 133.744 361.967 105C353.866 141.186 352.562 142.581 318.293 148.907C346.882 149.372 361.129 163.698 361.316 193C362.247 163.698 376.401 148.721 406.293 148.535Z"
            fill="white"
          />
        </g>
      </g>
    </g>
    <defs>
      <filter
        id="filter0_d_111_3613"
        x="102"
        y="105"
        width="308"
        height="308"
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
          result="effect1_dropShadow_111_3613"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_111_3613"
          result="shape"
        />
      </filter>
      <filter
        id="filter1_d_111_3613"
        x="314.293"
        y="105"
        width="96"
        height="96"
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
          result="effect1_dropShadow_111_3613"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_111_3613"
          result="shape"
        />
      </filter>
      <clipPath id="clip0_111_3613">
        <rect
          width="300"
          height="300"
          fill="white"
          transform="translate(106 106)"
        />
      </clipPath>
      <clipPath id="clip1_111_3613">
        <rect
          width="88"
          height="88"
          fill="white"
          transform="translate(406 105) rotate(90)"
        />
      </clipPath>
    </defs>
  </svg>
);

export default memo(LogoIcon);
