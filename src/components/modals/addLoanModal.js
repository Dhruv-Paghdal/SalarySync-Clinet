import React, {useContext, useEffect, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import PayrollContext from '../../context/payrollContext';
import { Controller, useForm} from "react-hook-form";
import { allEmployeeList } from '../../services/employeeService';
import { addLoan } from '../../services/loanService';
import Spinner from 'react-bootstrap/esm/Spinner';
import Select from 'react-select';

const AddLoanModal = () => {
    const context = useContext(PayrollContext);
    const [employeeListData, setEmployeeListData] = useState([]);
    const [loading, setLoading] = useState(false);
    const {setAlertData, setAlertShow, setAlertVariant, setModalShow, setRefresh} = context;
    const { register, handleSubmit, formState: { errors }, control} = useForm();
    const onSubmit = async(payload) => {
        setLoading(true);
        const {success, status, data, message} = await addLoan(payload);
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
    useEffect(() => {
        (async()=>{
            const {success, status, data, message} = await allEmployeeList();
            if(!success) {
                setAlertVariant("danger");
                setAlertShow(true);
                setAlertData(message);
            }
             else{
                const options = data.length > 0 ? (()=>{
                    const temp = [];
                    for (const item of data) {
                        temp.push({
                            value: item._id,
                            label: item.employeeId + " " + item.name
                        })
                    }
                    return temp;
                })(): []
                setEmployeeListData(options);
            }
        })()
    }, [])   
  return (
    <>
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                Loan
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="mb-3">
                <Col><Form.Label>Employee</Form.Label></Col>
                <Col>
                    <Controller 
                        name="employee"
                        control={control}
                        render={({ value, field }) => (
                            <Select
                            styles={{
                                control: provided => ({
                                ...provided,
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #dee2e6',
                                borderRadius: '0.375rem'
                                }),
                            }}
                            options={employeeListData}
                            value={employeeListData.find(c => c.value === value)}
                            onChange={val => field.onChange(val.value)}
                            placeholder="--Select--"
                            isSearchable={true}
                            />
                          )}
                        rules={{ required: {value: true, message: "Employee is required"}}}
                    />
                    <p className="pt-2 mb-0" style={{fontSize: "13px", textAlign: "left", color: "#6c8080"}}> {errors.employee && errors.employee.message}</p>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col><Form.Label>Amount</Form.Label></Col>
                <Col><Form.Control type="number" step="any" style={{background: "#FFFFFF"}} {...register("amount", {required: {value: true, message: "Amount is required"}, valueAsNumber: true, min: {value: 1, message: "Invalid amount"}})}/> <p className="pt-2 mb-0" style={{fontSize: "13px", textAlign: "left", color: "#6c8080"}}> {errors.amount && errors.amount.message}</p> </Col>
            </Row>
            <Row>
                <Col><Form.Label>Date</Form.Label></Col>
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
                <Col className='text-end'><Button type='submit' className='w-100'>Add</Button></Col>
            </Row>
        </Form>       
        </Modal.Body>
    </>
  )
}

export default AddLoanModal