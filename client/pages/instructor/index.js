import { useState, useEffect } from 'react';
import axios from 'axios'
import InstructorRoute from '../../components/routes/InstructorRoute';
import Link from 'next/link';

const InstructorIndex = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        const {data} = await axios.get('/api/instructor-courses');
        setCourses(data);
    };

    return ( 
        <InstructorRoute>
            <h1 className='jumbotron text-center square'>Instructor Dashboard</h1>
            {courses && courses.map(course => (
                <>
                    <div className='media pt-2'>
                        <div>Img</div>
                        <div className='media-body pl-2'>
                            <div className='row'>
                                <div className='col'>
                                    <Link href={`/instructor/course/view/${course.slug}`} className='pointer mt-2 text-primary'>
                                        <h5>
                                            {course.name}
                                        </h5>
                                    </Link>
                                    <p style={{ marginTop: "-10px"}}>{course.lessons.length} Lessons</p>

                                    {course.lessons.length < 5 ? (
                                        <p>At least 5 lessons are required to publish a course</p>
                                        ) : course.published ? (
                                            <p>Your course is live in the marketplace</p>
                                        ) : (
                                            <p>Your course is ready to be published</p>
                                        )
                                    }
                                </div>

                                <div className='col-md-3 mt-3 text-center'>
                                    {course.published ? (
                                        <p>Published</p>
                                    ) : (
                                        <p>Draft</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ))}
        </InstructorRoute>
    );
};

export default InstructorIndex;