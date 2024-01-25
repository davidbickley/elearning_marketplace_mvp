import axios, { all } from 'axios';
import { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { useRouter } from 'next/router';
import InstructorRoute from '../../../../components/routes/InstructorRoute';
import CourseCreateForm from '../../../../components/forms/CourseCreateForm';
import UpdateLessonForm from '../../../../components/forms/UpdateLessonForm';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';


const CourseEdit = () => {
    
    const [values, setValues] = useState({
        name: '',
        description: '',
        price: '49.99',
        uploading: false,
        paid: true,
        category: '',
        loading: false,
        lessons: [],
        imagePreview: ''
    })

    const [course, setCourse] = useState({});
    const [show, setShow] = useState(false);
    const [current, setCurrent] = useState({})

    const router = useRouter();
    const { slug } = router.query;

    useEffect(() => {
        loadCourse()
    }, [slug])

    const loadCourse = async () => {
        const { data } = await axios.get(`/api/course/${slug}`);
        setValues(data)
    }

    const handleChange = (event) => {
        setValues({
            ...values, 
            [event.target.name]: event.target.value
        })
    }

    const handleImage = () => {
        //
    }

    const handleDrag = (event, index) => {
        // console.log("ON DRAG ==> ", index)
        event.dataTransfer.setData('itemIndex', index)
    }

    const handleDrop = async (event, index) => {
        // console.log("ON DROP ==> ", index)
        const movingItemIndex = event.dataTransfer.getData('itemIndex');
        const targetItemIndex = index;
        let allLessons = values.lessons;

        let movingItem = allLessons[movingItemIndex]; //clicked/dragged item to re-order
        allLessons.splice(movingItemIndex, 1) // Cut the item from the index
        allLessons.splice(targetItemIndex, 0, movingItem) // push item to after target item index

        setValues({...values, lessons: [...allLessons] });

        const { data } = await axios.patch(`/api/course/${slug}`, {
            ...values, 
        });

        toast("Lesson Order Updated")
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
   
        try {
            const { data } = await axios.patch(`/api/course/${slug}`, {
                ...values, 
            });
            toast('Course updated.');
            // router.push("/instructor");
        } catch (err) {
            if (err.response) {
                console.log("Server Response:", err.response.data);
                toast(err.response.data);
            } else {
                console.log("Error:", err);
                toast('An error occurred. Please try again.');
            }
        }
    }

    const handleDelete = async (index) => {
        const answer = window.confirm('Are you sure you want to delete this lesson?')
        if(!answer) return

        let allLessons = values.lessons

        const removed = allLessons.splice(index, 1)
        setValues({ ...values, lessons: allLessons });

        // Send request to server
        const { data } = await axios.put(`/api/course/${slug}/${removed[0]._id}`);
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
    const handleUpdateLesson = async (event) => {
        event.preventDefault();
        console.log(current)
        try {            
            const { data } = await axios.patch(`/api/course/lesson/${slug}/${current._id}`, current );
            handleClose();
            setCourse(data);

            if(data.ok) {
                let arr = values.lessons;
                const index = arr.findIndex((element) => element._id === current._id)
                arr[index] = current;
                setValues({ ...values, lessons: arr})
            }

            toast("Lesson Updated");
        } catch (err) {
            console.log(err)
            toast("Lesson Update Failed.")
        }
    }

    return ( 
        <InstructorRoute>
            <h1 className='jumbotron text-center square'>Edit Course</h1>
            <div className='pt-3 pb-3'>
                <CourseCreateForm 
                    handleSubmit={handleSubmit} 
                    handleImage={handleImage} 
                    handleChange={handleChange}
                    values={values}
                    setValues={setValues}
                    editPage={true}
                />
            </div>
            {/* <pre>{JSON.stringify(values, null, 4)}</pre> */}

            <hr/>

            <div className='row pb-5'>
                <div className='col lesson-list'>
                    <h4>{values && values.lessons && values.lessons.length} Lessons</h4>
                    <ListGroup
                        onDragOver={event => event.preventDefault()}
                    >
                        {values && values.lessons && values.lessons.map((lesson, index) => (
                            <ListGroup.Item 
                                key={index} 
                                draggable={true}
                                onDragStart={event => handleDrag(event, index)}
                                onDrop={event => handleDrop(event, index)}
                            >
                                <a onClick={() => { handleShow(); setCurrent(lesson) } }>
                                    {lesson.title}
                                </a>
                                <a className='float-right' 
                                    title="Edit Course" 
                                    id="t-1"
                                    onClick={() => { handleDelete(index) }}
                                >
                                    Delete
                                </a>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            </div>

            <Modal 
                show={show} 
                onHide={handleClose}
                onCancel={() => setShow(false)} 
                centered="true"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Update Lesson</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <UpdateLessonForm
                            current={current}
                            setCurrent={setCurrent}
                            handleUpdateLesson={handleUpdateLesson}
                            handleClose={handleClose}
                    />
                </Modal.Body>
            </Modal>

        </InstructorRoute>
    )
}

export default CourseEdit