import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import UserNav from '../nav/UserNav';

const UserRoute = ({ children, showNav = true }) => {
    const [ ok, setOk] = useState(false);

    const router = useRouter();

    useEffect(() => {
        fetchUser();
      }, []);
     
    const fetchUser = async () => {
        try {
            const { data } = await axios.get("/api/current-user");
            if (data.ok) setOk(true);
          } catch (err) {
            console.log(err);
            setOk(false);
            router.push('/login');
          }
        };
    return (
        <>
            {!ok ? 'Loading...' : (
              <div className='container-fluid'>
                <div className='row'>
                  {showNav && (
                    <div className='col-md-2'>
                      <UserNav />
                    </div>
                  )}
                  <div className='col-md-10'>
                    {children}
                  </div>
                </div>
              </div>
              )
            }
        </>
    )
}

export default UserRoute;