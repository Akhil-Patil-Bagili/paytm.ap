import React, { useEffect, useState } from "react";
import axios from "axios";
import { Heading } from "../components/Heading";
import { SubHeading } from "../components/SubHeading";
import { Button } from "../components/Button";

export const Profile = () => {
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
                console.log(userResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData(); 
    }, []);

    return (
        <div className="bg-slate-100 min-h-screen flex flex-col items-center pt-10">
            <Heading label="Profile" />
            <div className="mt-5 bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                <div className="mt-4">
                    <div className="text-lg"><strong>Username:</strong> {user.username}</div>
                    <div className="text-lg"><strong>First Name:</strong> {user.firstName}</div>
                    <div className="text-lg"><strong>Last Name:</strong> {user.lastName}</div>
                </div>
                <div className="mt-6 flex justify-center">
                    <Button label="Edit Profile" onClick={() => console.log("Edit Profile Clicked")} />
                </div>
            </div>
        </div>
    );
};
