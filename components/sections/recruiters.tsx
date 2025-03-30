import { Recruiter } from "@/constants";
import ProfileCard from "../custom/profile-card";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface RecruitersProps {
  recruiters: Recruiter[];
}

const Recruiters = ({ recruiters }: RecruitersProps) => {
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Get unique countries
  const countries = ["all", ...Array.from(new Set(recruiters.map(r => r.country)))];

  // Filter recruiters based on selected country
  const filteredRecruiters = selectedCountry === "all"
    ? recruiters
    : recruiters.filter(r => r.country === selectedCountry);

  // Update drag constraints when filtered recruiters change or on resize
  useEffect(() => {
    const updateConstraints = () => {
      if (containerRef.current && scrollRef.current) {
        const containerWidth = scrollRef.current.scrollWidth;
        const viewportWidth = containerRef.current.offsetWidth;
        setDragConstraints({
          left: -(Math.max(0, containerWidth - viewportWidth)),
          right: 0
        });
      }
    };

    updateConstraints();
    window.addEventListener('resize', updateConstraints);
    return () => window.removeEventListener('resize', updateConstraints);
  }, [filteredRecruiters]);

  return (
    <div className="bg-white rounded-lg p-4 shadow-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Top Recruiters</h3>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="px-3 py-1 border rounded-md text-sm outline-none"
        >
          {countries.map(country => (
            <option key={country} value={country}>
              {country === "all" ? "All Countries" : country}
            </option>
          ))}
        </select>
      </div>
      <div ref={containerRef} className="relative w-full overflow-hidden">
        <motion.div
          drag="x"
          dragConstraints={dragConstraints}
          dragElastic={0}
          dragMomentum={false}
          className="flex space-x-4 cursor-grab active:cursor-grabbing">
          <div ref={scrollRef} className="flex gap-2 min-w-max">
            {filteredRecruiters.map((recruiter) => (
              <ProfileCard
                key={recruiter.company}
                title={recruiter.company}
                subtitle={recruiter.openings}
                country={recruiter.country}
                image={""}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Recruiters; 