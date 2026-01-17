import React from "react";

interface ChocolateBarProps {
  className?: string;
  size?: number;
  filled?: boolean; // Whether the bar is filled (full) or outlined (empty)
}

export function ChocolateBar({
  className = "",
  size = 24,
  filled = true
}: ChocolateBarProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      title="Chocolate Bar"
    >
      {filled ? (
        // Filled chocolate bar
        <>
          <rect
            x="4"
            y="6"
            width="16"
            height="12"
            rx="2"
            fill="#8B4513"
            stroke="#6B3410"
            strokeWidth="1.5"
          />
          {/* Grid lines to make it look like chocolate squares */}
          <line x1="12" y1="6" x2="12" y2="18" stroke="#6B3410" strokeWidth="1" />
          <line x1="4" y1="12" x2="20" y2="12" stroke="#6B3410" strokeWidth="1" />
          <line x1="8" y1="6" x2="8" y2="18" stroke="#6B3410" strokeWidth="0.5" opacity="0.5" />
          <line x1="16" y1="6" x2="16" y2="18" stroke="#6B3410" strokeWidth="0.5" opacity="0.5" />
          <line x1="4" y1="9" x2="20" y2="9" stroke="#6B3410" strokeWidth="0.5" opacity="0.5" />
          <line x1="4" y1="15" x2="20" y2="15" stroke="#6B3410" strokeWidth="0.5" opacity="0.5" />
        </>
      ) : (
        // Outlined chocolate bar (empty/partial)
        <>
          <rect
            x="4"
            y="6"
            width="16"
            height="12"
            rx="2"
            fill="none"
            stroke="#8B4513"
            strokeWidth="1.5"
          />
          {/* Grid lines */}
          <line x1="12" y1="6" x2="12" y2="18" stroke="#8B4513" strokeWidth="1" opacity="0.6" />
          <line x1="4" y1="12" x2="20" y2="12" stroke="#8B4513" strokeWidth="1" opacity="0.6" />
        </>
      )}
    </svg>
  );
}

interface ChocolateBarAmountProps {
  amount: number; // Amount in USDC/USD (1 = 1 full bar)
  className?: string;
  size?: number;
  showCount?: boolean; // Whether to show the numeric count
}

export function ChocolateBarAmount({
  amount,
  className = "",
  size = 20,
  showCount = true
}: ChocolateBarAmountProps) {
  const fullBars = Math.floor(amount);
  const hasPartial = amount % 1 > 0;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {/* Show up to 5 full bars visually, then show count */}
      {fullBars > 0 && fullBars <= 5 && (
        <>
          {[...Array(fullBars)].map((_, i) => (
            <ChocolateBar key={i} size={size} filled={true} />
          ))}
        </>
      )}
      {hasPartial && fullBars < 5 && (
        <ChocolateBar size={size} filled={false} />
      )}
      {showCount && (
        <span className="text-sm font-semibold">
          {amount > 5 ? `${amount}×` : amount % 1 === 0 ? '' : amount.toFixed(1)}
        </span>
      )}
    </div>
  );
}
