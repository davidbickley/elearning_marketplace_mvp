import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const StudentRoute = ({ children, showNav = true }) => {
    const [ok, setOk] = useState(false);
    const router = useRouter();

    useEffect(() => {
        
        fetchUser();
    }, [router]);

    const fetchUser = async () => {
        try {
            const { data } = await axios.get("/api/current-user");
            if (data.ok) {
                setOk(true);
            } else {
                router.push('/login');
            }
        } catch (err) {
            console.log(err);
            router.push('/login');
        }
    };

    if (!ok) {
        return <div>Loading...</div>;
    }

    return (
        <div className='container-fluid'>
            {children}
        </div>
    );
}

export default StudentRoute;
