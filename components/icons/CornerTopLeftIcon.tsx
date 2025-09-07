import React from 'react';

export const CornerTopLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="100"
    height="100"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M0 50 V85 C0 95 5 100 15 100 H50 V97 H15 C7 97 3 93 3 85 V50 H0Z M0 30 V10 H20 V13 H3 V30 H0Z M30 0 H50 V3 H30 V0Z"
      fill="currentColor"
    />
  </svg>
);
