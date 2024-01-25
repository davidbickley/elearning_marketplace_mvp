import { Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';

const AddLessonForm = ({
    values, setValues, handleAddLesson, handleClose
}) => {
    return ( 
        <div className='container pt-3'>
            <Form
                onSubmit={handleAddLesson}
            >
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Title</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="What do you want to call this lesson?" 
                        onChange={(event) => setValues({ ...values, title: event.target.value })}
                        value={values.title}
                        required={true}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Summary</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={7} 
                        cols={7}
                        onChange={(event) => setValues({ ...values, content: event.target.value })}
                        value={values.content}
                        placeholder='What is the lesson about?'
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Vimeo ID</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder='Provide the ID of your video on Vimeo'
                        onChange={(event) => setValues({ ...values, vimeo_id: event.target.value })}
                        value={values.vimeo_id}
                    />
                </Form.Group>
                <Button 
                    variant="primary" 
                    className="col mt-3 mb-3" 
                    size="lg"
                    onClick={(event) => {
                        handleAddLesson(event); 
                        handleClose();
                    }}
                >
                    Save and Close
                </Button>
            </Form>
        </div>
    )
}

export default AddLessonForm