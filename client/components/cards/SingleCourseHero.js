import { Badge, Button } from "react-bootstrap"
import { CustomPlaceholder } from "react-placeholder-image"
import { currencyFormatter } from "../../utils/helpers"

import SingleCourse from '../../pages/course/[slug]'

const SingleCourseHero = ({course, user, paid, handlePaidEnrollment, handleFreeEnrollment, enrolled }) => {

    // Determine button text and disabled state
    let buttonText;
    let isButtonDisabled = false;

    if (user) {
        if (enrolled.status) {
            buttonText = "Resume Course"; // User is enrolled
        } else {
            buttonText = "Enroll"; // User is not enrolled
        }
    } else {
        buttonText = "Login to Enroll"; // User is not logged in
        isButtonDisabled = true; // Disable button as user is not logged in
    }
    
    return (
        <div className='jumbotron bg-primary square'>
                <div className='row'>
                    <div className='col-md-8'>
                        {/* Title */}
                        <h1 className='text-light font-weight-bold'>{course.name}</h1>
                        {/* Description */}
                        <p className='lead'>{course.description && course.description.substring(0,160)}</p>
                        {/* Category */}
                        <Badge pill className='p-3 mb-2 text-emphasis-primary'>{course.category}</Badge>
                        {/* Author */}
                        <p>Taught by { course.instructor.name }</p>
                        {/* Updated on */}
                        <p>Last updated: {new Date(course.updatedAt).toLocaleDateString()}</p>
                        {/* Price */}
                        <h4 className='text-light'>{ course.paid ? currencyFormatter({
                            amount: course.price,
                            currency: 'usd'
                        }) : "Free" }                        
                        </h4>
                    </div>
                    <div className='col-md-4'>
                        {/* Show video preview or course image */}
                        {course.lessons[0].vimeo_id ? (
                            <iframe 
                                src={`https://player.vimeo.com/video/${course.lessons[0].vimeo_id}`}
                                width="440"
                                height="260"
                                frameBorder="0"
                                allow="autoplay; fullscreen; picture-in-picture"
                            >
                            </iframe>
                        ) : (
                            <CustomPlaceholder width={300} height={200} className='img img-fluid' />
                        )}
                        {/* Enroll Button */}
                        <Button 
                            onClick={paid ? handlePaidEnrollment : handleFreeEnrollment}
                            disabled={isButtonDisabled}
                        >
                            {buttonText}
                        </Button>
                    </div>
                </div>
            </div>
    )
}

export default SingleCourseHero