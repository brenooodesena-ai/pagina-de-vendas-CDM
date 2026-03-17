'use client';

import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";
import { Sparkles } from "lucide-react";
import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

interface LiquidMetalButtonProps {
  label?: string;
  onClick?: () => void;
  viewMode?: "text" | "icon";
}

export function LiquidMetalButton({
  label = "Get Started",
  onClick,
  viewMode = "text",
}: LiquidMetalButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<
    Array<{ x: number; y: number; id: number }>
  >([]);
  const shaderRef = useRef<HTMLDivElement>(null);
  // biome-ignore lint/suspicious/noExplicitAny: External library without types
  const shaderMount = useRef<any>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleId = useRef(0);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const dimensions = useMemo(() => {
    if (viewMode === "icon") {
      return {
        width: 46,
        height: 46,
        innerWidth: 42,
        innerHeight: 42,
        shaderWidth: 46,
        shaderHeight: 46,
      };
    } else {
      return {
        width: 340, // Even larger for high impact
        height: 70, 
        innerWidth: 336,
        innerHeight: 66,
        shaderWidth: 340,
        shaderHeight: 70,
      };
    }
  }, [viewMode]);

  useEffect(() => {
    const styleId = "shader-canvas-style-exploded";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .shader-container-exploded canvas {
          width: 100% !important;
          height: 100% !important;
          display: block !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          border-radius: 100px !important;
        }
        @keyframes ripple-animation {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.6;
          }
          100% {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
          }
        }
        @keyframes glow-breath {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.35;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.08);
            opacity: 0.5;
          }
        }
      `;
      document.head.appendChild(style);
    }

    const loadShader = async () => {
      try {
        if (shaderRef.current) {
          if (shaderMount.current?.destroy) {
            shaderMount.current.destroy();
          }

          shaderMount.current = new ShaderMount(
            shaderRef.current,
            liquidMetalFragmentShader,
            {
              u_repetition: 4,
              u_softness: 0.5,
              u_shiftRed: 0.3,
              u_shiftBlue: 0.3,
              u_distortion: 0,
              u_contour: 0,
              u_angle: 45,
              u_scale: 8,
              u_shape: 1,
              u_offsetX: 0.1,
              u_offsetY: -0.1,
            },
            undefined,
            0.6,
          );
        }
      } catch (error) {
        console.error("[v0] Failed to load shader:", error);
      }
    };

    loadShader();

    return () => {
      if (shaderMount.current?.destroy) {
        shaderMount.current.destroy();
        shaderMount.current = null;
      }
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (delicate effect)
    // Tilt TOWARDS the mouse for a premium "follow" effect
    const rotateY = ((x - centerX) / centerX) * 12; // Increased for better depth perception
    const rotateX = ((centerY - y) / centerY) * -12; 
    
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    shaderMount.current?.setSpeed?.(1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    setRotate({ x: 0, y: 0 }); // Reset tilt
    shaderMount.current?.setSpeed?.(0.6);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (shaderMount.current?.setSpeed) {
      shaderMount.current.setSpeed(2.4);
      setTimeout(() => {
        if (isHovered) {
          shaderMount.current?.setSpeed?.(1);
        } else {
          shaderMount.current?.setSpeed?.(0.6);
        }
      }, 300);
    }

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ripple = { x, y, id: rippleId.current++ };

      setRipples((prev) => [...prev, ripple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, 600);
    }

    onClick?.();
  };

  return (
    <div 
      className="relative inline-block"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ isolation: "isolate" }} // Prevent stacking context issues
    >
      <div
        style={{
          perspective: "1200px",
          perspectiveOrigin: "50% 50%",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Premium Multi-layered Ambient Glow */}
        <div 
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: `${dimensions.width * 1.8}px`,
            height: `${dimensions.height * 3.5}px`,
            background: "radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, rgba(212, 175, 55, 0.08) 45%, transparent 75%)",
            borderRadius: "50%",
            zIndex: 0,
            pointerEvents: "none",
            filter: "blur(70px)",
            animation: "glow-breath 6s ease-in-out infinite",
          }}
        />
        <div 
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: `${dimensions.width * 1.2}px`,
            height: `${dimensions.height * 2.2}px`,
            background: "radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%)",
            borderRadius: "50%",
            zIndex: 0,
            pointerEvents: "none",
            filter: "blur(40px)",
            opacity: 0.6,
          }}
        />
        <div
          style={{
            position: "relative",
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            willChange: "transform",
            transition: isHovered 
              ? "transform 0.1s ease-out, width 0.4s ease, height 0.4s ease" // Tighter transform response
              : "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              transformStyle: "preserve-3d",
              transition:
                "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease, gap 0.4s ease",
              transform: "translate3d(0, 0, 100px)", // Extreme Z-depth for text
              zIndex: 30,
              pointerEvents: "none",
              backfaceVisibility: "visible",
            }}
          >
            {viewMode === "icon" && (
              <Sparkles
                size={20}
                style={{
                  color: "#000000", // Black for premium look
                  filter: "drop-shadow(0px 1px 1px rgba(255, 255, 255, 0.3))",
                  transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  transform: "scale(1)",
                }}
              />
            )}
            {viewMode === "text" && (
              <span
                style={{
                  fontSize: "18px",
                  color: "#FFFFFF",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  textShadow: "0px 1px 2px rgba(0, 0, 0, 0.4)",
                  transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  transform: "scale(1)",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </span>
            )}
          </div>

          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`,
              transformStyle: "preserve-3d",
              transition:
                "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease",
              transform: `translate3d(0, ${isPressed ? "1px" : "0"}, 50px) scale(${isPressed ? 0.98 : 1})`, // Strong Z-separation
              zIndex: 20,
              backfaceVisibility: "visible",
            }}
          >
            <div
              style={{
                width: `${dimensions.innerWidth}px`,
                height: `${dimensions.innerHeight}px`,
                margin: "2px",
                borderRadius: "100px",
                background: "linear-gradient(135deg, #CFB53B 0%, #F5E1A4 20%, #D4AF37 50%, #F5E1A4 80%, #B8860B 100%)", // Metallic 5-stop gradient
                boxShadow: isPressed
                  ? "inset 0px 2px 4px rgba(0, 0, 0, 0.2), inset 0px 1px 2px rgba(0, 0, 0, 0.1)"
                  : "none",
                transition:
                  "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease, box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </div>

          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`,
              transformStyle: "preserve-3d",
              transition:
                "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease",
              transform: `translate3d(0, ${isPressed ? "1px" : "0"}, 1px) scale(${isPressed ? 0.98 : 1})`,
              zIndex: 10,
              backfaceVisibility: "hidden",
            }}
          >
            <div
              style={{
                height: `${dimensions.height}px`,
                width: `${dimensions.width}px`,
                borderRadius: "100px",
                boxShadow: isPressed
                  ? "0px 1px 2px rgba(0, 0, 0, 0.5)"
                  : "0px 0px 0px 1px rgba(212, 175, 55, 0.3)",
                transition:
                  "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease, box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
                background: "rgb(0 0 0 / 0)",
              }}
            >
              <div
                ref={shaderRef}
                className="shader-container-exploded"
                style={{
                  borderRadius: "100px",
                  overflow: "hidden",
                  position: "relative",
                  width: `${dimensions.shaderWidth}px`,
                  maxWidth: `${dimensions.shaderWidth}px`,
                  height: `${dimensions.shaderHeight}px`,
                  transition: "width 0.4s ease, height 0.4s ease",
                }}
              />
            </div>
          </div>

          <button
            ref={buttonRef}
            onClick={handleClick}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              outline: "none",
              zIndex: 40,
              transformStyle: "preserve-3d",
              transform: "translate3d(0, 0, 110px)", // Highest layer to ensure hit area
              transition:
                "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease",
              overflow: "visible", 
              borderRadius: "100px",
            }}
            aria-label={label}
          >
            {ripples.map((ripple) => (
              <span
                key={ripple.id}
                style={{
                  position: "absolute",
                  left: `${ripple.x}px`,
                  top: `${ripple.y}px`,
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0) 70%)", // Dark ripples for gold contrast
                  pointerEvents: "none",
                  animation: "ripple-animation 0.6s ease-out",
                }}
              />
            ))}
          </button>
        </div>
      </div>
    </div>
  );
}
