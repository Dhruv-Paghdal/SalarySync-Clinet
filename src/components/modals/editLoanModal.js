import React, {useContext, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import moment from 'moment';
import PayrollContext from '../../context/payrollContext';
import { useForm } from "react-hook-form"; 
import { editLoan } from '../../services/loanService';
import Spinner from 'react-bootstrap/esm/Spinner';

const EditLoanModal = (props) => {
    const propData = props.modalData[0];
    const context = useContext(PayrollContext);
    const [loading, setLoading] = useState(false);
    const {setAlertData, setAlertShow, setAlertVariant, setModalShow, setRefresh} = context;
    const { register, handleSubmit, formState: { errors }} = useForm({
        defaultValues: {
            "name": propData?.employeeDetail[0]?.name,
            "employeeId": propData?.employeeDetail[0]?.employeeId,
            "amount": parseFloat(propData?.amount?.["$numberDecimal"])
            .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            "date": moment.utc(propData?.date).format("YYYY-MM-DD"),
        }
    });
    const onSubmit = async(formData) => {
        setLoading(true);
        const payload = {
            loanID: propData?._id,
            amount: formData.amount,
            date: formData.date
        }
        const {success, status, data, message} = await editLoan(payload);
        if(!success) {
            setAlertVariant("danger");
        }
        else{
            setAlertVariant("success");
            setRefresh(true);
        }
        setLoading(false);
        setAlertShow(true);
        setAlertData(message);
        setModalShow(false);
    }
  return (
    <>
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                Edit loan
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row className="mb-3">
                    <Col><Form.Label>Employee name</Form.Label></Col>
                    <Col><Form.Control type="text" placeholder="" {...register("name")} disabled/></Col>
                </Row>
                <Row className="mb-3">
                    <Col><Form.Label>Employee ID</Form.Label></Col>
                    <Col><Form.Control type="text" placeholder="" {...register("employeeId")} disabled/></Col>
                </Row>
                <Row className="mb-3">
                    <Col><Form.Label>Amount</Form.Label></Col>
                    <Col><Form.Control type="number" step="any" style={{background: "#FFFFFF"}} {...register("amount", {required: {value: true, message: "Amount is required"}, valueAsNumber: true, min: {value: 1, message: "Invalid amount"}})}/> <p className="pt-2 mb-0" style={{fontSize: "13px", textAlign: "left", color: "#6c8080"}}> {errors.amount && errors.amount.message}</p> </Col>
                </Row>
                <Row>
                    <Col><Form.Label>Date <span style={{fontWeight: "300"}}>(dd-mm-yyyy)</span></Form.Label></Col>
                    <Col><Form.Control type="date" style={{background: "#FFFFFF"}} {...register("date", { valueAsDate: true, required: {value: true, message: "Date is required"}})} /><p className="pt-2 mb-0" style={{fontSize: "13px", textAlign: "left", color: "#6c8080"}}> {errors.date && errors.date.message}</p> </Col>
                </Row>
                <Row className='my-2'>
                    <Col></Col>
                    <Col>
                    {loading && <div className='text-center'>
                        <Spinner animation="border" role="status" variant="primary">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>}
                    </Col>
                </Row>
                <Row>
                    <Col></Col>
                    <Col className='text-end'><Button type='submit' className='w-100'>Edit</Button></Col>
                </Row>
            </Form>       
        </Modal.Body>
    </>
  )
}

export default EditLoanModal