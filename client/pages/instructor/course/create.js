import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { useRouter } from 'next/router';
import InstructorRoute from '../../../components/routes/InstructorRoute';
import CourseCreateForm from '../../../components/forms/CourseCreateForm';


const CourseCreate = () => {
    
    const [values, setValues] = useState({
        name: '',
        description: '',
        price: '49.99',
        uploading: false,
        paid: true,
        category: '',
        loading: false,
        imagePreview: ''
    })
    
    const router = useRouter();

    const handleChange = (event) => {
        setValues({
            ...values, 
            [event.target.name]: event.target.value
        })
    }

    const handleImage = () => {
        //
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
            const { data } = await axios.post('/api/course', {
                ...values, 
            });
            toast('Great! Now you can start adding lessons.');
            router.push('/instructor');
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
    

    return ( 
        <InstructorRoute>
            <h1 className='jumbotron text-center square'>Create Course</h1>
            <div className='pt-3 pb-3'>
                <CourseCreateForm 
                    handleSubmit={handleSubmit} 
                    handleImage={handleImage} 
                    handleChange={handleChange}
                    values={values}
                    setValues={setValues}
                    />
            </div>
            <pre>{JSON.stringify(values, null, 4)}</pre>
        </InstructorRoute>
    )
}

export default CourseCreate