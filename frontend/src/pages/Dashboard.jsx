import { useEffect, useState } from "react";
import axios from "axios";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";

export const Dashboard = () => {
    const [balance, setBalance] = useState(0);
    const [user, setUser] = useState({}); 

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No token found");
            return; 
        }

        const fetchData = async () => {
            try {
                const userResponse = await axios.get("http://localhost:3000/api/v1/user/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(userResponse.data); 
                console.log(userResponse.data)

                const balanceResponse = await axios.get("http://localhost:3000/api/v1/account/balance", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBalance(balanceResponse.data.balance); 
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData(); 
    }, []);

    return (
        <div>
            <Appbar user={user} />
            <div className="m-8">
                <Balance value={balance} />
                <Users />
            </div>
        </div>
    );
};
