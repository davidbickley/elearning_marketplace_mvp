import { Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateLessonForm = ({
    current, setCurrent, handleUpdateLesson, handleClose
}) => {
    return ( 
        <div className='container pt-3'>
            <Form
                onSubmit={handleUpdateLesson}
            >
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Title</Form.Label>
                    <Form.Control 
                        type="text" 
                        onChange={(event) => setCurrent({ ...current, title: event.target.value })}
                        value={current.title}
                        required={true}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Summary</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={7} 
                        cols={7}
                        onChange={(event) => setCurrent({ ...current, content: event.target.value })}
                        value={current.content}
                    />
                </Form.Group>
                {current.vimeo_id && (
                    <iframe 
                        src={`https://player.vimeo.com/video/${current.vimeo_id}`}
                        width="440"
                        height="260"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                    >
                    </iframe>
                )}
                <Form.Group className="mb-3">
                    <Form.Label>Vimeo ID</Form.Label>
                    <Form.Control 
                        type="text" 
                        onChange={(event) => setCurrent({ ...current, vimeo_id: event.target.value })}
                        value={current.vimeo_id}
                    />
                    <Form.Check // prettier-ignore
                        type="switch"
                        id="free-preview-switch"
                        name="free_preview"
                        label="Free Preview"
                        defaultChecked={current.free_preview}
                        onChange={value => setCurrent({ ...current, free_preview: value })}

                    />

                </Form.Group>
                <Button 
                    variant="primary" 
                    className="col mt-3 mb-3" 
                    size="lg"
                    onClick={(event) => {
                        handleUpdateLesson(event); 
                        handleClose();
                    }}
                >
                    Save and Close
                </Button>
            </Form>
        </div>
    )
}

export default UpdateLessonForm