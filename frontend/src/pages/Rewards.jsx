import RewardCard from "../components/RewardCard";

export default function Rewards() {
    //Temp static data later we can connect API
    const rewards = [
        {
            _id: 1,
            title: "Chocolate Muffin",
            pointsRequired: 50,
            image: "https://www.shutterstock.com/image-photo/closeup-chocolate-muffin-isolated-on-600nw-2483081425.jpg"
        },
        {
            _id: 2,
            title: "Croissant",
            pointsRequired: 40,
            image: "https://dylanpatisserie.com/cdn/shop/files/croisant.png?v=1764334087"
        },
        {
            _id: 3,
            title: "Macaron box",
            pointsRequired: 80,
            image: "https://packagingbee.co.uk/wp-content/uploads/2022/03/macaron-packaging-ideas.jpg"
        },
    ];

    return (
        <div className="min-h-screen bg-[#fdf6f0] p-6">
            <h1 className="text-3xl font-bold text-center text-amber-700 mb-8">
                Collect Your Rewards!!
            </h1>

            <div className="grid md:grid-cols-3 gap-6">
                {rewards.map((reward) => (
                    <RewardCard key={reward._id} reward={reward} />
                ))}

            </div>
        </div>
    );
}