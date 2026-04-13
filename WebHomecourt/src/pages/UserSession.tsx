import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';


function UserSession() {
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            console.log("Session:", data.session);
            setUser(data.session?.user ?? null); // Sets user data or null if there is no session
        });
    }, []);

    // To let us go to the home page
    const handleRedirect = () => {
        // Navigate to a specific path
        navigate('/');
    }

    return (
        <div>
            {user ? <p>User with email: {user.email}</p> : <p>No user session :(</p>}
            <button onClick={handleRedirect} className="bg-morado-lakers rounded text-white mt-2 px-3 py-3">Go to home</button>
        </div>
    )
}

export default UserSession