import React from "react";

const TimerDisplay = ({
  countdown,
  className,
}: {
  countdown: number[];
  className?: string;
}) => {
  return (
    <div className={`flex gap-x-2 text-sm text-darkgray ${className ?? ""}`}>
      <span>{countdown[0]}d</span>
      <span>{countdown[1]}h</span>
      <span>{countdown[2]}m</span>
      <span>{countdown[3]}s</span>
    </div>
  );
};

export const Timer = React.memo(TimerDisplay);
