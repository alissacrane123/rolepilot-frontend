interface IconProps {
  className?: string;
}

export function CheckmarkIcon({ className }: IconProps): React.JSX.Element {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 12 12"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      className={className}
    >
      <polyline points="2 6 5 9 10 3" />
    </svg>
  );
}

export function CloseSmallIcon({ className }: IconProps): React.JSX.Element {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function DisclosureChevronIcon({
  className,
}: IconProps): React.JSX.Element {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className={className}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
