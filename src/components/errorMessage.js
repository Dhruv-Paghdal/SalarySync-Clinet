import React, { useContext } from 'react';
import Alert from 'react-bootstrap/Alert';
import PayrollContext from '../context/payrollContext';
import Container from 'react-bootstrap/Container';

const ErrorMessage = () => {
    const context = useContext(PayrollContext);
    const { alertShow, alertData, setAlertShow, alertVariant} = context;
    (()=>{
        setTimeout(()=>{
            setAlertShow(false)
        }, 5000)
    })()
  return (
    <div style={{position: "relative"}}>
        <Container className="my-2" style={{position: "absolute", left: "0", right: "0"}}>
            <Alert key={"danger"} variant={alertVariant} show={alertShow} style={{fontWeight: "bold", textAlign: "center"}}>
                {alertData}
            </Alert>
        </Container>
    </div>
  )
}

export default ErrorMessage;