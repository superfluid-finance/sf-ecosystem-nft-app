import React from "react";

const TimerDisplay = ({
  countdown,
  className,
  loading = true,
}: {
  countdown: number[];
  className?: string;
  loading?: boolean;
}) => {
  return (
    <div
      className={`${loading ? "shimmer-bg animate-pulse bg-gray-300 blur-sm" : ""} flex gap-x-2 text-sm text-darkgray ${className ?? ""}`}
    >
      <span>{countdown[0]}d</span>
      <span>{countdown[1]}h</span>
      <span>{countdown[2]}m</span>
      <span>{countdown[3]}s</span>
    </div>
  );
};

export const Timer = React.memo(TimerDisplay);
