import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router'
import InstructorRoute from '../../../../components/routes/InstructorRoute';
import AddLessonForm from '../../../../components/forms/AddLessonForm';
import axios from 'axios';
import { toast } from 'react-toastify';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';

import ReactMarkdown from 'react-markdown';

const CourseView = () => {
    const [course, setCourse] = useState({});
    const [show, setShow] = useState(false);
    const [values, setValues] = useState({
        title: '',
        content: '',
        vimeo_id: ''
    });

    // Student Count
    const [ students, setStudents ] = useState(0);

    // Route to course slug url
    const router = useRouter();
    const { slug } = router.query

    // Load relevant course into main window
    useEffect (() => {
        loadCourse()
    }, [slug]);

    useEffect (() => {
        course && studentCount()
    }, [course]);

    const loadCourse = async () => {
        const { data } = await axios.get(`/api/course/${slug}`)
        setCourse(data);
    }

    const studentCount = async () => {
        const { data } = await axios.post(`/api/instructor/student-count`, {
            courseId: course._id
        });
        console.log("STUDENT COUNT => ", data)
        setStudents(data.length);
    }

    // Add Lesson Modal
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const Link = ({ id, children, title, onClick }) => (
        <OverlayTrigger overlay={<Tooltip id={id}>{title}</Tooltip>}>
            <Button 
                variant="link" 
                onClick={onClick} 
                style={{ padding: '0 5px', border: 'none', background: 'none' }}
            >
                {children}
            </Button>
        </OverlayTrigger>
      );

    // Add Lesson Functions
    const handleAddLesson = async (event) => {
        event.preventDefault();
        console.log(values)
        try {            
            const { data } = await axios.post(`/api/course/lesson/${slug}/${course.instructor._id}`, values);
            setValues({
                ...values, 
                title: '',
                content: '',
                vimeo_id: ''
            });
            console.log(data)
            setCourse(data);
            toast("Lesson Added");
        } catch (err) {
            console.log(err)
            toast("Lesson Add Failed.")
        }
    }

    const handlePublish = async (event, courseId) => {
        try {
            let answer = window.confirm('One you publish, users will be able to enroll in the course via the marketplace')
            if (!answer) return;
            const { data } = await axios.patch(`/api/course/publish/${courseId}`)
            setCourse(data);
            toast("The course is published!")
        } catch (err) {
            console.log(err)
            toast("There has been an error. Try again.")
        }
    }

    const handleUnpublish = async (event, courseId) => {
        try {
            let answer = window.confirm('Unpublishing will remove the course from the marketplace')
            if (!answer) return;
            const { data } = await axios.patch(`/api/course/unpublish/${courseId}`)
            setCourse(data);
            toast("Course Unpublished.")
        } catch (err) {
            console.log(err)
            toast("There has been an error. Try again.")
        }
    }

    // Content to render on screen
    return (
        <InstructorRoute>
            <div className='container-fluid pt-3'>
                {course && (
                    <div className='container-fluid pt-1'>
                        <div className='media pt-2'>
                            <div>Image</div>
                            
                            <div className='media-body pl-2'>
                                <div className='row'>
                                    <div className='col'>
                                        <h5 className='mt-2 text-primary'>{course.name}</h5>
                                        <p>{course.lessons && course.lessons.length} Lessons</p>
                                        <p>{course.category}</p>
                                    </div>
                                    <div className='d-flex'>
                                        <Link 
                                            title="Num Students" 
                                            id="t-1"
                                        >
                                            #
                                        </Link>
                                        <Link 
                                            title="Edit Course" 
                                            id="t-1"
                                            onClick={() => {
                                                router.push(`/instructor/course/edit/${slug}`)
                                            }}
                                        >
                                            Edit
                                        </Link>

                                        {course.lessons && course.lessons.length < 5 ? (
                                            <p>Draft</p>
                                        ) : course.published ? (
                                            <Link 
                                                title="Publish Course" 
                                                id="t-2"
                                                onClick={(event) => {handleUnpublish(event, course._id)}}
                                            >
                                                Unpublish
                                            </Link>
                                        ) : (
                                            <Link 
                                                title="Publish Course" 
                                                id="t-2"
                                                onClick={(event) => {handlePublish(event, course._id)}}
                                            >
                                                Publish
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className='col'>
                                <ReactMarkdown children={course.description} />
                            </div>
                        </div>

                        <div className='row'>
                            <Button 
                                onClick={handleShow}
                                type="primary"
                            >
                                Add Lesson
                            </Button>
                        </div>
                        
                        <Modal 
                            show={show} 
                            onHide={handleClose}
                            onCancel={() => setShow(false)} 
                            centered="true"
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Add New Lesson</Modal.Title>
                            </Modal.Header>

                            <Modal.Body>
                                <AddLessonForm
                                        values={values}
                                        setValues={setValues}
                                        handleAddLesson={handleAddLesson}
                                        handleClose={handleClose}
                                />
                            </Modal.Body>
                        </Modal>

                        <div className='row pb-5'>
                            <div className='col lesson-list'>
                                <h4>{course && course.lessons && course.lessons.length} Lessons</h4>
                                <ListGroup>
                                    {course && course.lessons && course.lessons.map((lesson, index) => (
                                        <ListGroup.Item key={index}>
                                            {lesson.title}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </div>
                        </div>
    
                    </div>
                )}
            </div>
        </InstructorRoute>
    )
}

export default CourseView