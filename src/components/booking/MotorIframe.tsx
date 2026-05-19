"use client";
import { useEffect, useRef, useState } from "react";

const MOTOR_URL = "https://maxrevenue.aicstudio.tech/motor/casa-hotel-la-mariela";

export default function MotorIframe() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(180);

  useEffect(() => {
    function handler(e: MessageEvent) {
      if (e.data?.type === "lisa-motor-height" && typeof e.data.height === "number") {
        setHeight(Math.max(160, e.data.height));
      }
    }
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto">
      <iframe
        ref={iframeRef}
        src={MOTOR_URL}
        style={{ width: "100%", height, border: "none", display: "block", borderRadius: 24 }}
        title="Motor de reservas — Casa Hotel La Mariela"
        scrolling="no"
      />
    </div>
  );
}
