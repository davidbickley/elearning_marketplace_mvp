import {useState, useEffect, useContext } from 'react';
import { Context } from '../../context';
import InstructorRoute from '../../components/routes/InstructorRoute';
import axios from 'axios';
import { stripeCurrencyFormatter } from '../../utils/helpers'

const InstructorRevenue = () => {
    const [ balance, setBalance ] = useState({ pending: [] })
    const [ loading, setLoading ] = useState(false)

    useEffect(() => {
        sendBalanceRequest()
    }, [])
    
    const sendBalanceRequest = async () => {
        const { data } = await axios.get('/api/instructor/balance')
        setBalance(data)
    };

    const handlePayoutSettings = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/instructor/payout-settings');
            window.location.href= data

        } catch (err) {
            console.log(err);
            alert("Unable to access payout setting. Please try later.");
        }
        setLoading(false);
    }

    return (
        <InstructorRoute>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-8 offset-md-2 bg-light p-5'>
                        <h2>Revenue Report</h2>
                        <small>You get paid directly from Stripe, to your bank account, every X days.</small>
                        <hr/>
                        <h4>Pending Balance <span className='float-right'>{balance.pending && balance.pending.map((bp, i) => (
                            <span key={i} className='float-right'>{stripeCurrencyFormatter(bp)}</span>
                        ))}</span></h4>
                        <small>For 48 hours</small>
                        <hr/>
                        <h4>Payouts {" "} 
                                <span className='float-right'>
                                    {!loading ? (
                                        <a onClick={handlePayoutSettings}>(settings)</a>
                                    ) : (
                                        <>Loading...</>
                                    )}
                                </span>
                        </h4>
                        <small>Update your Stripe account details</small>
                    </div>
                </div>
            </div>
        </InstructorRoute>
    )
}

export default InstructorRevenue