import { Button, Card, Badge }from 'react-bootstrap';
import Link from 'next/link';
import { CustomPlaceholder } from 'react-placeholder-image';
import { currencyFormatter } from '../../utils/helpers';

function CourseCard({ course }) {

    const { name, instructor, description, price, image, slug, paid, category } = course;

    return (
        <Link href={`/course/${slug}`}>
            <Card style={{ width: '18rem' }}>        
            <CustomPlaceholder width={200} height={140} />
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Text>
                    By {instructor?.name}
                </Card.Text>
                {/* <Badge pill bg='secondary' className='p-2 text-white'>{category}</Badge> */}
                <h4 className='pt-2'>{ paid ? currencyFormatter({
                    amount: price,
                    currency: "usd"
                }) : "Free"}</h4>
                <Button variant="primary">Go somewhere</Button>
            </Card.Body>
            </Card>
        </Link>
    );
}

export default CourseCard;