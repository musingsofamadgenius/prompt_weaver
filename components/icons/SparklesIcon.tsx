
import React from 'react';

export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2a9 9 0 0 0-9 9v11h18V11a9 9 0 0 0-9-9Z" />
    <path d="M9 12h.01" />
    <path d="M15 12h.01" />
    <path d="M4 22 6 20l2 2 2-2 2 2 2-2 2 2 2-2 2 2" />
  </svg>
);
