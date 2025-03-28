import { Recruiter } from "@/constants";
import ProfileCard from "../custom/profile-card";
import { useState } from "react";

interface RecruitersProps {
  recruiters: Recruiter[];
}

const Recruiters = ({ recruiters }: RecruitersProps) => {
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  
  // Get unique countries
  const countries = ["all", ...Array.from(new Set(recruiters.map(r => r.country)))];
  
  // Filter recruiters based on selected country
  const filteredRecruiters = selectedCountry === "all" 
    ? recruiters 
    : recruiters.filter(r => r.country === selectedCountry);

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
      <div className="w-full overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {filteredRecruiters.map((recruiter) => (
            <ProfileCard
              key={recruiter.company}
              title={recruiter.company}
              subtitle={recruiter.openings}
              country={recruiter.country} image={""}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recruiters; 