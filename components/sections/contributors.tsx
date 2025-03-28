import { Contributor } from "@/constants";
import ProfileCard from "../custom/profile-card";
import { useState } from "react";

interface ContributorsProps {
  contributors: Contributor[];
}

const Contributors = ({ contributors }: ContributorsProps) => {
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  
  // Get unique countries
  const countries = ["all", ...Array.from(new Set(contributors.map(c => c.country)))];
  
  // Filter contributors based on selected country
  const filteredContributors = selectedCountry === "all" 
    ? contributors 
    : contributors.filter(c => c.country === selectedCountry);

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
      <div className="w-full overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {filteredContributors.map((contributor) => (
            <ProfileCard
              key={contributor.name}
              title={contributor.name}
              subtitle={contributor.contributions}
              country={contributor.country} image={""}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contributors; 