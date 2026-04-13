import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import MorphSVGPlugin from "gsap/MorphSVGPlugin";
import type { SkillMorphInfo } from "../types/schemes.type";
gsap.registerPlugin(MorphSVGPlugin);

export default function Morphify({ skills }: { skills: SkillMorphInfo[] }) {
  const [index, setIndex] = useState(0);
  const svgPath = useRef<SVGPathElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % skills.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [skills.length]);

  useEffect(() => {
    const next = skills[index];
    if (svgPath.current) {
      gsap.to(svgPath.current, {
        duration: 0.8,
        morphSVG: next.svgPath,
        fill: next.color,
        ease: "expo.out",
      });
    }
  }, [index, skills]);

  return (
    <svg
      className="w-full h-full"
      width="100%"
      height="100%"
      viewBox="0 0 25 25"
      preserveAspectRatio="xMidYMid meet"
    >
      <path ref={svgPath} d={skills[0].svgPath} fill={skills[0].color} />
    </svg>
  );
}
