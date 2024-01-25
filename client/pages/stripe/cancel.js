import UserRoute from '../../components/routes/UserRoute'

const stripeCancel = () => {
    return(
        <UserRoute showNav={false}>
            <div className='row text-center'>
                <div className='col'>
                    <p className='lead'>Payment Failed. Try again</p>
                </div>
            </div>
        </UserRoute>
    )
}

export default stripeCancel;