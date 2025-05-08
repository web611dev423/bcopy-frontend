import ProfileCard from "../custom/profile-card";
import { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchContributors } from "@/store/reducers/contributorSlice";

import { useAuth } from "@/hooks/useAuth";

const Contributors = () => {
  const { isAuthenticated, user } = useAuth();
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.contributors);

  useEffect(() => {
    dispatch(fetchContributors());
  }, [dispatch]);

  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated && user?.country) {
      setSelectedCountry(user.country);
    } else {
      setSelectedCountry('all');
    }
  }, [isAuthenticated, user]);

  // Get unique countries
  const countries = useMemo(() =>
    ["all", ...Array.from(new Set(items.map(c => c.country)))],
    [items]
  );

  // Filter contributors based on selected country
  const filteredContributors = useMemo(() =>
    selectedCountry === "all"
      ? items
      : items.filter(c => c.country === selectedCountry),
    [items, selectedCountry]
  );

  // Update drag constraints when filtered contributors change or on resize
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
  }, [filteredContributors.length]); // Only depend on length changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-white rounded-lg p-4 shadow-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Top Contributors</h3>
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
          className="flex space-x-4 cursor-grab active:cursor-grabbing"
        >
          <div ref={scrollRef} className="flex gap-2 min-w-max">
            {filteredContributors.map((contributor) => (
              <ProfileCard
                key={contributor._id}
                title={contributor.name}
                subtitle={contributor.contributions.length + " contributions"}
                country={contributor.country}
                image={""}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contributors;