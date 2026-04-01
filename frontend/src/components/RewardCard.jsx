import { motion } from "framer-motion";

export default function RewardCard({ reward }) {
    return (
        <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
        >
            <img 
            src={reward.image || "https://source.unsplash.com/400x300/?dessert"}
            alt={reward.title}
            className="w-full h-40 object-cover"
            />

            <div className="p-4">
                <h2 className="text-lg font-bold text-gray-800">
                    {reward.title}
                </h2>
                <p className="text-sm text-gray-500">
                    {reward.storeName || "Coffee Store"}
                </p>
                <p className="text-amber-600 font-semibold mt-2">
                    {reward.pointsRequired} Points
                </p>

                <button className="mt-3 w-full bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition">
                    Redeem
                </button>

            </div>

        </motion.div>
    );
}