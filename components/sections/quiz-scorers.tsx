'use client';

import { useEffect, useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchQuizScorerList } from "@/store/reducers/quizSlice";
import ProfileCard from "../custom/profile-card";
import { ExternalLink, Trophy } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
const QuizScorers = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAuth();
  const { scorers, loading } = useAppSelector(state => state.quizzes);
  const [selectedCountry, setSelectedCountry] = useState("all");
  const router = useRouter();
  useEffect(() => {
    dispatch(fetchQuizScorerList());
  }, [dispatch]);
  // For horizontal scrolling
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });


  useEffect(() => {
    if (isAuthenticated && user?.country) {
      setSelectedCountry(user.country);
    } else {
      setSelectedCountry('all');
    }
  }, [isAuthenticated, user]);
  const countries = useMemo(() =>
    ["all", ...Array.from(new Set(scorers.map(c => c.country)))],
    [scorers]
  );

  // Filter contributors based on selected country
  const filteredScorers = useMemo(() =>
    selectedCountry === "all"
      ? scorers
      : scorers.filter(c => c.country === selectedCountry),
    [scorers, selectedCountry]
  );
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
  }, [scorers.length]);


  if (loading) return (
    <div className="flex justify-center items-center h-16">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>)
  return (
    <div className="bg-white rounded-lg pl-2 shadow-md w-full">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold flex items-center">
          {/* <Trophy className="h-4 w-4 mr-2 text-yellow-500" /> */}
          Top Quiz Scorers
        </h3>
        <div className="justify-right">
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
          <Button
            variant="ghost"
            onClick={() => router.push('/userlist')}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
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
            {filteredScorers.length > 0 ? (
              filteredScorers.map((scorer) => (
                <ProfileCard
                  key={scorer._id}
                  title={scorer.name}
                  subtitle={`Score: ${scorer.quizScore || 0}`}
                  country={scorer.country}
                  image={""}
                // icon={<Trophy className="h-3 w-3 text-yellow-500" />}
                />
              ))
            ) : (
              <div className="flex items-center justify-center w-full py-4 text-gray-500">
                No quiz scorers found
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizScorers;