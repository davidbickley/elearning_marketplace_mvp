import { useContext, useEffect, useState } from 'react';
import { Context } from '../../context';
import UserRoute from '../../components/routes/UserRoute';
import axios from 'axios';
import { CustomPlaceholder } from 'react-placeholder-image';
import Link from 'next/link';

const UserIndex = () => {
    const { state:{user} } = useContext(Context);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false)
    
    useEffect(() => {
        loadCourses()
    }, [])

    const loadCourses = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/user-courses');
            setCourses(data);
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    }

    return (
        <UserRoute>
            {loading && <div>Loading...</div>}
            <h1 className="jumbotron text-center square">User Dashboard</h1>

            {courses && courses.map((course) => {
                return (
                    <div key={course._id} className='media pt-2 pb-1'>
                        <CustomPlaceholder width={80} height={80} />
                        <div className='row'>
                            <div className='col'>
                                <Link href={`/user/course/${course.slug}`} className='pointer'>
                                    <h5 className='mt-2 text-primary'>{course.name}</h5>
                                </Link>
                                <p style={{ marginTop: '-10px'}}>{course.lessons.length} lessons</p>
                                <p className='text-muted' style={{marginTop: '-15px', fontSize: '12px'}}>By {course.instructor.name}</p>
                            </div>
                            <div className='col-md-3 mt-3 text-center'>
                                <Link href={`/user/course/${course.slug}`} className='pointer'>
                                    <h2 className='mt-2 text-primary'>Play</h2>
                                </Link>
                            </div>
                        </div>
                    </div>
                )
            })}
        </UserRoute>
    )
}

export default UserIndex;