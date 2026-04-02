import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import RewardCard from "../components/RewardCard";
import API from "../services/api";

export default function Rewards() {
    
    const [rewards, setRewards] = useState([]);

    useEffect(() => {
        fetchRewards();
    }, []);

    const fetchRewards = async () => {
        try {
            const res = await API.get("/rewards");
            setRewards(res.data);
        } catch (error) {
            console.error("Error fetching rewards", error);
        }
    };
    

   return (
    <div className="min-h-screen bg-gradient-to-r from-[#e6a65c] to-[#bfb8ae] p-6">


      {/* Title */}
      <h1 className="text-center text-3xl font-bold mt-8 mb-10">
        Collect Your Rewards!!
      </h1>

      {/* Grid */}
      <div className="flex flex-wrap justify-center gap-8">

        {rewards.map((reward) => (
          <RewardCard key={reward._id} reward={reward} />
        ))}

      </div>

    </div>
  );
}