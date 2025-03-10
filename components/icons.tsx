import React from "react";

export * from "lucide-react";

type IconProps = React.HTMLAttributes<SVGElement>;

export const Spinner = (props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export const PixIcon = (props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    fill="none"
    viewBox="0 0 22 22"
    {...props}
  >
    <path
      fill="#4BB8A9"
      fillRule="evenodd"
      d="M4.837 16.809c.862 0 1.673-.336 2.283-.945l3.295-3.296a.626.626 0 01.866 0l3.308 3.308c.61.61 1.42.945 2.283.945h.648l-4.173 4.174a3.337 3.337 0 01-4.72 0L4.44 16.809h.396zM16.872 5.152c-.862 0-1.673.335-2.283.945l-3.307 3.308a.613.613 0 01-.866 0L7.12 6.108a3.206 3.206 0 00-2.283-.945H4.44L8.626.978a3.338 3.338 0 014.721 0l4.174 4.174h-.65z"
      clipRule="evenodd"
    />
    <path
      fill="#4BB8A9"
      fillRule="evenodd"
      d="M.978 8.626L3.47 6.133h1.366c.595 0 1.177.24 1.597.661L9.73 10.09c.308.308.713.462 1.118.462.405 0 .81-.154 1.118-.462l3.308-3.308a2.274 2.274 0 011.597-.661h1.618l2.505 2.505a3.338 3.338 0 010 4.72l-2.505 2.506h-1.618c-.594 0-1.176-.24-1.597-.661l-3.307-3.309c-.598-.597-1.64-.597-2.237.001l-3.296 3.295c-.42.42-1.002.662-1.597.662H3.47L.978 13.347a3.338 3.338 0 010-4.721"
      clipRule="evenodd"
    />
  </svg>
);
