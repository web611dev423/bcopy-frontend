import ProfileCard from "../custom/profile-card";
import { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchRecruiters } from "@/store/reducers/recruiterSlice";
import { useAuth } from "@/hooks/useAuth";
interface RecruitersProps {
  recruiters: any[];
}

const Recruiters = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAuth();
  const { items, loading, error } = useAppSelector((state) => state.recruiters);
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if ((isAuthenticated && user?.country))
      setSelectedCountry(user.country);
    else
      setSelectedCountry('all');
  }, [isAuthenticated, user])
  // Get unique countries
  const countries = ["all", ...Array.from(new Set(items.map(r => r.country)))];

  // Filter recruiters based on selected country
  const filteredRecruiters = useMemo(() =>
    selectedCountry === "all"
      ? items
      : items.filter(c => c.country === selectedCountry),
    [items, selectedCountry]
  );

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
  }, [filteredRecruiters.length]);

  useEffect(() => {
    dispatch(fetchRecruiters());
  }, [dispatch]);

  return (
    <div className="bg-white rounded-lg p-4 shadow-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Top Recruiters</h3>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="px-3 py-1  text-sm rounded-md border outline-none"
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
                key={recruiter._id}
                title={recruiter.companyName}
                subtitle={recruiter.positions.length + " open positions"}
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