import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const CourseCreateForm = ({
    handleSubmit, 
    handleImage, 
    handleChange, 
    values, 
    setValues,
    editPage = false,
}) => {

    const children = []
    for (let i = 49.99; i <= 2999.99; i+=50) {
        children.push(<option key={i.toFixed(2)}>${i.toFixed(2)}</option>)
    }

    return (
        <>
            {values && (
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Control 
                            type="text" 
                            name="name" 
                            className='form-control' 
                            placeholder='Name'
                            value={values.name}
                            onChange={handleChange} 
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Control  
                            as="textarea"
                            name="description" 
                            className='form-control'
                            cols={7}
                            rows={7}
                            value={values.description}
                            onChange={handleChange} 
                        />
                    </Form.Group>

                    <div className='form-row mb-3'>
                        <div className='col-md-6'>
                            <Form.Group>
                                <Form.Select 
                                    size='lg'
                                    style={{ width: "100%"}}
                                    value={values.paid}
                                    onChange={(v) => setValues({...values, paid: !values.paid })}
                                >
                                    <option value={true}>Paid</option>
                                    <option value={false}>Free</option>
                                </Form.Select>
                            </Form.Group>
                        </div>
                        <div className='col'>
                            {values.paid && (
                                <Form.Group>
                                    <Form.Select 
                                        defaultValue={'49.99'}
                                        style={{ width: "100%"}}
                                        onChange={(v) => setValues({...values, price: v })}
                                    >
                                        {children}
                                    </Form.Select>
                                </Form.Group>
                            )}
                        </div>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Control 
                            type="text" 
                            name="category" 
                            className='form-control' 
                            placeholder='Category'
                            value={values.category}
                            onChange={handleChange} 
                        />
                    </Form.Group>

                    {/* <Form.Group className="mb-3">
                        <label className='btn btn-outline-secondary btn-block text-left'>
                            {values.loading ? "Uploading" : "Image Upload"}
                            <input typr='file' name='image' onChange={handleImage} accept="image/*" hidden />
                        </label>
                    </Form.Group> */}

                    <div className='row'>
                        <div className='col'>
                            <Button 
                                onClick={handleSubmit} 
                                disabled={values.loading || values.uploading} 
                                className='btn btn-primary'
                            >
                                {values.loading ? 'Saving...' : "Save and Continue"}
                            </Button>
                        </div>
                    </div>


                </Form>
            )}
        </>


    )
}

export default CourseCreateForm