import { useCallback, useEffect, useRef, useState } from "react";

interface Bubble {
  id: number;
  size: number;
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  floatY: number;
  driftPhase: number;
  speed: number;
  opacity: number;
  popped: boolean;
  popScale: number;
}

const BUBBLE_CONFIGS = [
  { size: 28, left: 5, top: 80, speed: 0.3 },
  { size: 48, left: 15, top: 70, speed: 0.25 },
  { size: 20, left: 25, top: 90, speed: 0.35 },
  { size: 64, left: 38, top: 75, speed: 0.22 },
  { size: 32, left: 50, top: 85, speed: 0.32 },
  { size: 22, left: 60, top: 92, speed: 0.38 },
  { size: 72, left: 70, top: 68, speed: 0.2 },
  { size: 40, left: 82, top: 78, speed: 0.28 },
  { size: 26, left: 90, top: 88, speed: 0.33 },
  { size: 56, left: 8, top: 60, speed: 0.26 },
  { size: 18, left: 45, top: 95, speed: 0.4 },
  { size: 36, left: 75, top: 72, speed: 0.24 },
  { size: 24, left: 33, top: 82, speed: 0.34 },
  { size: 44, left: 55, top: 65, speed: 0.21 },
];

export function BubbleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const [bubbles, setBubbles] = useState<Bubble[]>(() =>
    BUBBLE_CONFIGS.map((b, i) => ({
      id: i,
      size: b.size,
      baseX: b.left,
      baseY: b.top,
      x: 0,
      y: 0,
      floatY: 0,
      driftPhase: Math.random() * Math.PI * 2,
      speed: b.speed,
      opacity: 0,
      popped: false,
      popScale: 1,
    })),
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const popNearestBubble = useCallback((clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setBubbles((prev) => {
      let nearestIdx = -1;
      let nearestDist = Number.POSITIVE_INFINITY;
      prev.forEach((b, i) => {
        if (b.popped) return;
        const bx = (b.baseX / 100) * rect.width + b.x;
        const by = (b.baseY / 100) * rect.height + b.y + b.floatY;
        const dist = Math.hypot(
          clientX - rect.left - bx,
          clientY - rect.top - by,
        );
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestIdx = i;
        }
      });

      if (nearestIdx >= 0 && nearestDist < 120) {
        const next = [...prev];
        next[nearestIdx] = { ...next[nearestIdx], popped: true, popScale: 1.5 };
        setTimeout(() => {
          setBubbles((current) => {
            const respawned = [...current];
            respawned[nearestIdx] = {
              ...respawned[nearestIdx],
              popped: false,
              popScale: 1,
              floatY: 0,
              opacity: 0,
            };
            return respawned;
          });
        }, 2000);
        return next;
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Only pop bubble if click is not on an interactive element
      const target = e.target as HTMLElement;
      if (target.closest('a, button, input, select, textarea, [role="button"]'))
        return;
      popNearestBubble(e.clientX, e.clientY);
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [popNearestBubble]);

  useEffect(() => {
    let rafId: number;
    const animate = () => {
      setBubbles((prev) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return prev;

        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;

        return prev.map((b) => {
          if (b.popped) return b;

          let newFloatY = b.floatY - b.speed;
          if (newFloatY < -150) {
            newFloatY = 50;
          }

          const driftX = Math.sin(Date.now() / 1000 + b.driftPhase) * 8;

          let repelX = 0;
          let repelY = 0;
          const bx = (b.baseX / 100) * rect.width + driftX;
          const by = (b.baseY / 100) * rect.height + newFloatY;
          const dist = Math.hypot(mx - bx, my - by);
          if (dist < 120 && dist > 0) {
            const force = (120 - dist) / 120;
            repelX = ((bx - mx) / dist) * force * 40;
            repelY = ((by - my) / dist) * force * 40;
          }

          const progress = -newFloatY / 150;
          let opacity = 0;
          if (progress < 0.1) opacity = progress * 10;
          else if (progress > 0.7) opacity = (1 - progress) * 3.3;
          else opacity = 1;
          opacity = Math.max(0, Math.min(1, opacity));

          return {
            ...b,
            floatY: newFloatY,
            x: driftX + repelX,
            y: repelY,
            opacity,
          };
        });
      });
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
    >
      {bubbles.map((b) => (
        <span
          key={b.id}
          className="absolute rounded-full"
          style={{
            width: b.size,
            height: b.size,
            left: `${b.baseX}%`,
            top: `${b.baseY}%`,
            transform: `translate(${b.x}px, ${b.floatY + b.y}px) scale(${b.popped ? b.popScale : 1})`,
            opacity: b.popped ? 0 : b.opacity,
            transition: b.popped
              ? "transform 0.3s ease, opacity 0.3s ease"
              : "none",
            background:
              "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.55), rgba(134,197,160,0.06) 60%, rgba(26,43,95,0.04))",
            border: "1px solid rgba(26,43,95,0.07)",
            boxShadow: "inset 0 0 6px rgba(255,255,255,0.3)",
            pointerEvents: "none",
          }}
        />
      ))}
    </div>
  );
}
