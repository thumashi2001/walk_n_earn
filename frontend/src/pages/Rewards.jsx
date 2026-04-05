import { useEffect, useState } from "react";
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
    <div className="mx-auto max-w-5xl rounded-2xl bg-white/90 p-6 shadow-lg shadow-stone-200/80 ring-1 ring-stone-100 sm:p-8">
      <h1 className="mb-8 text-center text-3xl font-bold text-stone-800">
        Collect Your Rewards!!
      </h1>
      <div className="flex flex-wrap justify-center gap-8">
        {rewards.map((reward) => (
          <RewardCard key={reward._id} reward={reward} />
        ))}
      </div>
    </div>
  );
}