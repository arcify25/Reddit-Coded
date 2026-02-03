import React, { ReactNode, useRef, useState } from "react";

type ClickSparkProps = {
    children?: ReactNode;
    sparkColor?: string;
    sparkSize?: number;
    sparkRadius?: number;
    sparkCount?: number;
    duration?: number; // ms
    className?: string;
};

type Spark = {
    id: number;
    left: number;
    top: number;
    size: number;
    dx: number;
    dy: number;
    color: string;
    animate?: boolean;
};

export default function ClickSpark({
    children,
    sparkColor = "#fff",
    sparkSize = 8,
    sparkRadius = 20,
    sparkCount = 6,
    duration = 450,
    className = "",
}: ClickSparkProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [sparks, setSparks] = useState<Spark[]>([]);
    const idRef = useRef(1);

    const handleClick = (e: React.MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const clientX = e.clientX;
        const clientY = e.clientY;
        const originX = clientX - rect.left;
        const originY = clientY - rect.top;

        const newSparks: Spark[] = [];
        for (let i = 0; i < sparkCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            // radial distance random to look more organic
            const distance = Math.random() * sparkRadius;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;
            const size = Math.max(2, sparkSize + (Math.random() - 0.5) * (sparkSize * 0.6));

            newSparks.push({
                id: idRef.current++,
                left: originX - size / 2,
                top: originY - size / 2,
                size,
                dx,
                dy,
                color: sparkColor,
                animate: false,
            });
        }

        setSparks((prev) => [...prev, ...newSparks]);

        // Trigger animations in next tick
        setTimeout(() => {
            setSparks((prev) => prev.map((s) => ({ ...s, animate: true })));
        }, 20);

        // Cleanup after duration
        setTimeout(() => {
            setSparks((prev) => prev.filter((s) => !newSparks.some((ns) => ns.id === s.id)));
        }, duration + 50);
    };

    return (
        <div
            ref={containerRef}
            onClick={handleClick}
            className={`inline-block relative overflow-visible ${className}`}
        >
            {children}

            {/* Sparks */}
            <div className="pointer-events-none absolute inset-0 overflow-visible">
                {sparks.map((s) => (
                    <span
                        key={s.id}
                        style={{
                            position: "absolute",
                            left: s.left,
                            top: s.top,
                            width: s.size,
                            height: s.size,
                            background: s.color,
                            borderRadius: "50%",
                            transform: s.animate
                                ? `translate(${s.dx}px, ${s.dy}px) scale(0.6)`
                                : "translate(0,0) scale(1)",
                            opacity: s.animate ? 0 : 1,
                            transition: `transform ${duration}ms cubic-bezier(.2,.8,.2,1), opacity ${duration}ms linear`,
                            boxShadow: `0 0 6px ${s.color}55`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
