import { motion } from "framer-motion";

export default function RewardCard({ reward }) {
  return (
    <motion.div
      whileHover={{ scale: 1.07 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="bg-[#f3e4d3] rounded-2xl shadow-md overflow-hidden w-64 cursor-pointer hover:shadow-2xl"
    >
      {/* Image */}
      <div className="bg-white flex justify-center items-center h-40 rounded-t-2xl">
        <img
          src={reward.image}
          alt={reward.title}
          className="h-28 object-contain transition-transform duration-300 hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-4 text-left">
        <h2 className="font-semibold text-sm text-black">
          {reward.title}
        </h2>

        <p className="text-xs text-gray-600">
          Coffee store
        </p>

        <p className="text-xs text-black mt-1">
          {reward.pointsRequired} points
        </p>

        <button className="mt-4 bg-[#e2a45c] hover:bg-[#d4934b] text-black text-sm px-6 py-2 rounded-full transition duration-300 hover:scale-105">
          Redeem
        </button>
      </div>
    </motion.div>
  );
}