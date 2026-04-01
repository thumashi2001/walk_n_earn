import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <div className="bg-amber-100 shadow-md p-4 flex justify-between">
            <h1 className="font-bold text-xl">Step2Earn</h1>
            <div className="space-x-4">
                <Link to="/">Home</Link>
                <Link to="/rewards">Rewards</Link>
                <Link to="/admin">Admin</Link>
            </div>
        </div>
    );
}