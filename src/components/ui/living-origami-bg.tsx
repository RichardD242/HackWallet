"use client";

import React from "react";

type Drifter = {
  duration: number;
  delay: number;
  scale: number;
  yStart: number;
  yEnd: number;
  rStart: number;
  rEnd: number;
  flapDelay: number;
};

const drifters: Drifter[] = [...Array(15)].map((_, i) => {
  const pick = (min: number, max: number, seed: number) => {
    const raw = Math.sin(seed * 9973.13) * 10000;
    const fract = raw - Math.floor(raw);
    return min + fract * (max - min);
  };

  return {
    duration: pick(20, 40, i + 1),
    delay: pick(-40, 0, i + 11),
    scale: pick(0.2, 0.8, i + 21),
    yStart: pick(-30, 30, i + 31),
    yEnd: pick(-30, 30, i + 41),
    rStart: pick(-30, 30, i + 51),
    rEnd: pick(-30, 30, i + 61),
    flapDelay: pick(-4, 0, i + 71),
  };
});

export const Component = () => {
  return (
    <main className="hero-section h-screen w-full" aria-hidden>
      {drifters.map((drifter, i) => {
        const driftStyle = {
          "--y-start": `${drifter.yStart}vh`,
          "--y-end": `${drifter.yEnd}vh`,
          "--r-start": `${drifter.rStart}deg`,
          "--r-end": `${drifter.rEnd}deg`,
          animationDuration: `${drifter.duration}s`,
          animationDelay: `${drifter.delay}s`,
        } as React.CSSProperties;

        const craneStyle = {
          transform: `scale(${drifter.scale})`,
          animationDelay: `${drifter.flapDelay}s`,
        } as React.CSSProperties;

        return (
          <div key={i} className="drifter-container" style={driftStyle}>
            <div className="origami-crane" style={craneStyle}>
              <div className="crane-part body" />
              <div className="crane-part wing-left" />
              <div className="crane-part wing-right" />
              <div className="crane-part tail" />
            </div>
          </div>
        );
      })}

      <div className="relative z-10 max-w-2xl p-8 text-center" />
    </main>
  );
};
