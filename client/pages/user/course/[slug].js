import { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import axios from 'axios';
import StudentRoute from '../../../components/routes/StudentRoute';
import { CustomPlaceholder } from "react-placeholder-image";
import { Button, Nav } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import ReactMarkdown from 'react-markdown';

const SingleCourse = () => {
    const [clicked, setClicked] = useState(-1);
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [course, setCourse] = useState({ lessons: [] });
    const [completedLessons, setCompletedLessons] = useState([]);
    const [isCsrfTokenReady, setIsCsrfTokenReady] = useState(false); // State to track if CSRF token is ready

    // Force State update
    const [updateState, setUpdateState] = useState(false);

    // router
    const router = useRouter();
    const { slug } = router.query;

    // Fetch CSRF token on component mount
    useEffect(() => {
        getCsrfToken();
    }, []);

    // Load completed lessons once CSRF token is ready
    useEffect(() => {
        if (isCsrfTokenReady) {
            loadCompletedLessons();
        }
    }, [isCsrfTokenReady]);

    // Load course data based on URL slug
    useEffect(() => {
        if (slug) loadCourse();
    }, [slug]);

    // Fetch CSRF token and set it in Axios headers
    const getCsrfToken = async () => {
        const { data } = await axios.get('/api/csrf-token');
        axios.defaults.headers.common['X-CSRF-Token'] = data.csrfToken;
        setIsCsrfTokenReady(true); // Indicate that CSRF token is set
    }

    const loadCourse = async () => {
        const { data } = await axios.get(`/api/user/course/${slug}`);
        setCourse(data);
    };

    // Load completed lessons for the course
    const loadCompletedLessons = async () => {
        // Fetch CSRF token and set headers for the request
        const csrfToken = await getCsrfToken();
        const headers = {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
        };

        const { data } = await axios.post(`/api/list-completed`, {
            courseId: course._id,
        });
        console.log("COMPLETED LESSONS => ", data);
        setCompletedLessons(data);
    };

    // Mark a lesson as complete
    const markCompleted = async () => {
        const { data } = await axios.post(`/api/mark-completed`, {
            courseId: course._id,
            lessonId: course.lessons[clicked]._id,
        });
        console.log(data);
        setCompletedLessons([...completedLessons, course.lessons[clicked]._id])
    };

    // Mark a lesson as incomplete
    const markIncomplete = async () => {
        try {
            const { data } = await axios.post(`/api/mark-incomplete`, {
                courseId: course._id,
                lessonId: course.lessons[clicked]._id,
            });
            console.log(data);
            const all = completedLessons; 
            const index = all.indexOf(course.lessons[clicked]._id)
            console.log("ALL => ", all)
            if( index > -1 ) {
                all.splice(index, 1)
                console.log("REMOVED => ", all)
                setCompletedLessons(all)
                setUpdateState(!updateState); 
            }
        } catch (err) {
            console.log(err)
        }
    };

    return (
        <StudentRoute>
            <div className='row'>
                <div className='col-md-4' style={{ maxWidth: 320 }}>
                    <Button 
                        onClick={() => setCollapsed(!collapsed)}
                        className='text-white mt-1 btn-block mb-2'
                    >
                        {collapsed ? '>' : '< '}
                        {!collapsed && "Lessons"}
                    </Button>
                    <Nav 
                        defaultActiveKey={[clicked]}
                        className='flex-column' 
                        variant="pills" 
                        style={{ height: '80vh', overflow: 'scroll' }}
                    >
                        {course.lessons.map((lesson, index) => (
                            <Nav.Link onClick={() => setClicked(index)} eventKey={index} key={index}>
                                <CustomPlaceholder width={80} height={80}/>
                                {lesson.title.substring(0, 30)} {completedLessons.includes(lesson._id) ? (
                                    <>
                                        <p className='float-right text-primary ml-2'>(X)</p>                                        
                                    </>
                                ) : (
                                    <>
                                        <p className='float-right text-danger ml-2'>( )</p>
                                    </>
                                )}
                            </Nav.Link>
                        ))}
                    </Nav>
                </div>
                <div className='col-md-8'>
                    {clicked !== -1 ? (
                        <>
                            <div className='col alert alert-primary square'>
                                <b>{course.lessons[clicked].title.substring(0, 30)}</b>
                                {completedLessons.includes(course.lessons[clicked]._id) ? (
                                    <span className='float-right pointer' onClick={markIncomplete}>
                                        Mark as Incomplete
                                    </span>
                                ) : (
                                    <span className='float-right pointer' onClick={markCompleted}>
                                        Mark as Completed
                                    </span>
                                )}
                            </div>
                            {course.lessons[clicked].vimeo_id && (
                                <>
                                    <div className='wrapper'>
                                        <ReactPlayer 
                                            className="player" 
                                            url={`https://player.vimeo.com/video/${course.lessons[clicked].vimeo_id}`}
                                            controls
                                            onEnded={() => {
                                                console.log('video ended -> change to autocomplete lesson later')
                                            }}
                                        />
                                    </div>
                            
                                </>
                            )}
                            <ReactMarkdown 
                                children={course.lessons[clicked].content} 
                                className={'single-post'} 
                            />
                        </>
                    ) : (
                        <>Click a Lesson</>
                    )}
                </div>
            </div>
        </StudentRoute>
    )
}

export default SingleCourse;