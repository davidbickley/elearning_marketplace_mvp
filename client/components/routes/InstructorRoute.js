import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import InstructorNav from '../nav/InstructorNav';

const InstructorRoute = ({ children }) => {
    const [ ok, setOk] = useState(false);

    const router = useRouter();

    useEffect(() => {
        fetchInstructor();
      }, []);
     
    const fetchInstructor = async () => {
        try {
            const { data } = await axios.get("/api/current-instructor");
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
                  <div className='col-md-2'>
                    <InstructorNav />
                  </div>
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

export default InstructorRoute;