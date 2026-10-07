type Direction = "right" | "left" | "down" | "up-right";

const rotations: Record<Direction, number> = {
  right: 0,
  left: 180,
  down: 90,
  "up-right": -45,
};

export function DirectionalArrow({
  direction = "right",
  className = "",
}: {
  direction?: Direction;
  className?: string;
}) {
  return (
    <svg
      className={`directional-arrow ${className}`}
      data-direction={direction}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g transform={`rotate(${rotations[direction]} 12 12)`}>
        <g className="directional-arrow-stroke">
          <path
            d="M4 12h15M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
    </svg>
  );
}
