import { ListGroup } from "react-bootstrap"

const SingleCourseLessons = ({lessons}) => {
    return (
        <div className="container">
            <div className="row">
                <div className="col lesson-list">
                    {lessons && (
                        <h4>{lessons.length} Lessons</h4>
                    )}
                    <hr/>
                    <ListGroup>
                        {lessons && lessons.map((lesson, index) => (
                            <ListGroup.Item key={index}>
                                {lesson.title}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            </div>
        </div>
    )
}

export default SingleCourseLessons