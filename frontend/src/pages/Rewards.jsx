import Navbar from "../components/Navbar";
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
        {
            _id: 4,
            title: "Chocolate Muffin",
            pointsRequired: 50,
            image: "https://www.shutterstock.com/image-photo/closeup-chocolate-muffin-isolated-on-600nw-2483081425.jpg"
        },
        {
            _id: 5,
            title: "Croissant",
            pointsRequired: 40,
            image: "https://dylanpatisserie.com/cdn/shop/files/croisant.png?v=1764334087"
        },
        {
            _id: 6,
            title: "Macaron box",
            pointsRequired: 80,
            image: "https://packagingbee.co.uk/wp-content/uploads/2022/03/macaron-packaging-ideas.jpg"
        },
        {
            _id: 7,
            title: "Chocolate Muffin",
            pointsRequired: 50,
            image: "https://www.shutterstock.com/image-photo/closeup-chocolate-muffin-isolated-on-600nw-2483081425.jpg"
        },
        {
            _id: 8,
            title: "Croissant",
            pointsRequired: 40,
            image: "https://dylanpatisserie.com/cdn/shop/files/croisant.png?v=1764334087"
        },
        {
            _id: 9,
            title: "Macaron box",
            pointsRequired: 80,
            image: "https://packagingbee.co.uk/wp-content/uploads/2022/03/macaron-packaging-ideas.jpg"
        },
        {
            _id: 10,
            title: "Chocolate Muffin",
            pointsRequired: 50,
            image: "https://www.shutterstock.com/image-photo/closeup-chocolate-muffin-isolated-on-600nw-2483081425.jpg"
        },
        {
            _id: 11,
            title: "Croissant",
            pointsRequired: 40,
            image: "https://dylanpatisserie.com/cdn/shop/files/croisant.png?v=1764334087"
        },
        {
            _id: 12,
            title: "Macaron box",
            pointsRequired: 80,
            image: "https://packagingbee.co.uk/wp-content/uploads/2022/03/macaron-packaging-ideas.jpg"
        },
    ];

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