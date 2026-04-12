import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";

function UserSession() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            console.log("Session:", data.session);
            setUser(data.session?.user ?? null); // Sets user data or null if there is no session
        });
    }, []);

    return (
        <div>
            {user ? <p>User with email: {user.email}</p> : <p>No user session :(</p>}
        </div>
    )
}

export default UserSession