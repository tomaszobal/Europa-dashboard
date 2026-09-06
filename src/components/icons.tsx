interface P {
  className?: string;
}

const S = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconCompass({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S}>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 6.2l2.3 5.8-2.3 5.8-2.3-5.8z" />
      <path d="M12 1.8v1.6M12 20.6v1.6M1.8 12h1.6M20.6 12h1.6" />
    </svg>
  );
}

export function IconMap({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S}>
      <path d="M9 4.5L3.5 6.3v13.2L9 17.7l6 1.8 5.5-1.8V4.5L15 6.3 9 4.5z" />
      <path d="M9 4.5v13.2M15 6.3v13.2" />
    </svg>
  );
}

export function IconCards({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S}>
      <rect x="3" y="7" width="12.5" height="14" rx="2" />
      <path d="M8 4.2h11A2 2 0 0 1 21 6.2V17" />
      <path d="M6.5 11.5h5.5M6.5 14.5h3.5" />
    </svg>
  );
}

export function IconQuiz({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S}>
      <path d="M4 4.5h16v11.5H10l-6 4.5z" />
      <path d="M10.3 8.6a1.9 1.9 0 1 1 2.6 1.8c-.55.25-.65.7-.65 1.2" />
      <circle cx="12.1" cy="13.6" r="0.4" fill="currentColor" />
    </svg>
  );
}

export function IconPin({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S}>
      <path d="M12 21.5s-7-5.8-7-11.3a7 7 0 0 1 14 0c0 5.5-7 11.3-7 11.3z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

export function IconChart({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S}>
      <path d="M4.5 20V11M11 20V4.5M17.5 20v-6.5" />
      <path d="M3 20.5h18" />
    </svg>
  );
}

export function IconFlame({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S}>
      <path d="M12 2.8c1.2 3.4 5.2 5.3 5.2 9.9a5.2 5.2 0 0 1-10.4 0c0-1.9.8-3.4 1.9-4.9.4 1.1 1.3 1.8 1.3 1.8C9.6 7 10.8 4.7 12 2.8z" />
      <path d="M12 21.2a3 3 0 0 1-1.6-5.5c.5 1 1.6 1.2 1.6 1.2s-.2-1.7.8-2.7c.6 1.3 2.2 2.4 2.2 4a3 3 0 0 1-3 3z" />
    </svg>
  );
}

export function IconCheck({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S}>
      <path d="M4.5 12.8l4.6 4.6L19.5 6.9" />
    </svg>
  );
}

export function IconX({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function IconRefresh({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S}>
      <path d="M4.6 12a7.4 7.4 0 0 1 12.7-5.1L20 9.3" />
      <path d="M20 4.5v4.8h-4.8" />
      <path d="M19.4 12a7.4 7.4 0 0 1-12.7 5.1L4 14.7" />
      <path d="M4 19.5v-4.8h4.8" />
    </svg>
  );
}

export function IconSearch({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S}>
      <circle cx="11" cy="11" r="6.2" />
      <path d="M16.2 16.2L21 21" />
    </svg>
  );
}

export function IconEye({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S}>
      <path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  );
}

export function IconEyeOff({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S}>
      <path d="M4.5 4.5l15 15" />
      <path d="M9.9 6.3A9.4 9.4 0 0 1 12 5.8c6 0 9.5 6.2 9.5 6.2a17.6 17.6 0 0 1-3.3 3.8M6 8.4A16.8 16.8 0 0 0 2.5 12S6 18.2 12 18.2c1 0 1.9-.2 2.8-.5" />
    </svg>
  );
}

export function IconTrophy({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S}>
      <path d="M8 4h8v5.2a4 4 0 0 1-8 0z" />
      <path d="M8 5.2H5.2a2.8 2.8 0 0 0 2.9 3.4M16 5.2h2.8a2.8 2.8 0 0 1-2.9 3.4" />
      <path d="M12 13.4V17M8.5 20.5h7M9.5 17h5v3.5h-5z" />
    </svg>
  );
}

export function IconArrow({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S}>
      <path d="M4 12h15M13.5 5.5L20 12l-6.5 6.5" />
    </svg>
  );
}

export function IconStar({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S}>
      <path d="M12 3.2l2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.8-5.4 2.8 1-6-4.4-4.3 6.1-.9z" />
    </svg>
  );
}

export function IconShuffle({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S}>
      <path d="M3 7h3.5L17 17.5h3.5" />
      <path d="M3 17.5h3.5l2.6-2.7M14 9.2l3-2.7h3.5" />
      <path d="M18 4.5l3 2.7-3 2.7M18 15l3 2.5-3 2.5" />
    </svg>
  );
}

export function IconBook({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S}>
      <path d="M4.5 5.5a2 2 0 0 1 2-2h13v17h-13a2 2 0 0 0-2 2z" />
      <path d="M4.5 22.5v-17M8.5 7.5h7" />
    </svg>
  );
}

export function IconTarget({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.7" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" />
    </svg>
  );
}
