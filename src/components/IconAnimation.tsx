import {
    useCurrentFrame,
    interpolate,
    AbsoluteFill,
    useVideoConfig,
    Easing
} from "remotion";
import {Ellipse} from "@remotion/shapes";
import * as React from "react";

type IconAnimationProps = {
    startAt: number;
    color: string;
};

const IconAnimation: React.FC<IconAnimationProps> = ({ startAt, color }) => {
    const frame = useCurrentFrame(); // Get the current frame number

    const rotateY = interpolate(frame % 60, [0, 60], [0, 360], {
        extrapolateRight: "extend",
    });

    const { fps } = useVideoConfig();

    const durationInSeconds = 2; // Total animation duration
    const totalFrames = durationInSeconds * fps; // Convert to frame count

    const dashLength = 408; // Stroke-dasharray value

    // Create a continuous looping effect using interpolate
    const strokeDashoffset = interpolate(
        frame % totalFrames,
        [0, totalFrames],
        [dashLength, 0],
        {
            easing: Easing.inOut(Easing.ease),
            extrapolateRight: "clamp",
        }
    );

    const durationInSecondsIcon = 1.5;
    const totalFramesIcon = durationInSecondsIcon * fps;

    const adjustedFrame = frame - startAt;
    const scaleIcon = interpolate(
        adjustedFrame < 0 ? 0 : adjustedFrame, // Clamp before animation starts
        [0, totalFramesIcon],
        [0, 1],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: t => t, // linear; replace with easing function if needed
        }
    );

    return (
    <div
      style={{
        width: "50px",
        height: "50px",
        position: "relative",
        display: "flex",
        justifyContent: "center",
      }}
    >
        <div style={{
            transform: `scale(${scaleIcon})`,
        }}>
            <AbsoluteFill
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    marginTop: "30px",
                }}
            >
                <Ellipse
                    rx={30}
                    ry={10}
                    fill="none"
                    stroke={color}
                    strokeWidth={3}
                    strokeDasharray={dashLength}
                    strokeDashoffset={strokeDashoffset}
                />
            </AbsoluteFill>
            <div
                className={'red-class'}
                style={{
                    position: "absolute",
                    top: "-15px",
                    left: "50%",
                    transform: `translateX(-50%) rotateY(${rotateY}deg)`,
                    transformStyle: "preserve-3d", // (recommended for smooth 3D transform)
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={color}
                    style={{ width: "80px", height: "80px", color: "black" }}
                >
                    <path
                        fillRule="evenodd"
                        d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>

            {/* Blinking Circle Animation (Now frame-based) */}
            <div
                style={{
                    width: "15px",
                    height: "15px",
                    borderRadius: "50%",
                    position: "absolute",
                    top: "13px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: frame % 30 < 15 ? `${color}` : "white", // Toggle every 15 frames
                }}
            />
        </div>

    </div>
  );
};

export default IconAnimation;
