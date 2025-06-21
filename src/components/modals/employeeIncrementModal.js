import React, {useContext, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import {useForm} from "react-hook-form";
import { allEmployeeIncrement, employeeIncrement } from '../../services/employeeService';
import PayrollContext from '../../context/payrollContext';
import Spinner from 'react-bootstrap/esm/Spinner';

const EmployeeIncrementModal = (props) => {
    const employeeData = props.modalData;
    const context = useContext(PayrollContext);
    const [loading, setLoading] = useState(false);
    const {setAlertData, setAlertShow, setAlertVariant, setModalShow, setRefresh} = context;
    const { register, handleSubmit, formState: { errors }} = useForm({
        defaultValues: {
            "employee_id": props.individual ? employeeData?.employeeId : "",
            "employee_name": props.individual ? employeeData?.name : ""
        }
    });
    const onSubmit = async(payload) => {
        setLoading(true);
        delete payload.employee_id;
        delete payload.employee_name;
        if(props.individual){
            payload["id"] = employeeData?._id;
            const {success, status, data, message} = await employeeIncrement(payload);
            if(!success) {
                setAlertVariant("danger");
            }
            else{
                setAlertVariant("success");
                setRefresh(true);
            }
            setAlertShow(true);
            setAlertData(message);
            setModalShow(false);
        }
        else{
            const {success, status, data, message} = await allEmployeeIncrement(payload);
            if(!success) {
                setAlertVariant("danger");
            }
            else{
                setAlertVariant("success");
                setRefresh(true);
            }
            setAlertShow(true);
            setAlertData(message);
            setModalShow(false);
        }
        setLoading(false);
    }
  return (
    <>
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                Increment
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleSubmit(onSubmit)}>
                {props.individual && <Row className="mb-3">
                    <Col><Form.Label>Employee ID</Form.Label></Col>
                    <Col><Form.Control type="text" placeholder="" disabled {...register("employee_id")}/></Col>
                </Row>}
                {props.individual && <Row className="mb-3">
                    <Col><Form.Label>Name</Form.Label></Col>
                    <Col><Form.Control type="text" placeholder="" disabled {...register("employee_name")}/></Col>
                </Row>}  
                <Row className="mb-3">
                    <Col><Form.Label>Increment tye</Form.Label></Col>
                    <Col>
                        <Row>
                            <Col><Form.Check label="$" type="radio" value="RS" {...register("appraisal_type",{required: {value: true, message: "Increment type is requried"}})}/> <p style={{fontSize: "13px", textAlign: "left", color: "#6c8080"}}> {errors.appraisal_type && errors.appraisal_type.message}</p></Col>
                            <Col><Form.Check label="%" type="radio" value="%"{...register("appraisal_type",{required: {value: true, message: "Increment type is requried"}})}/> <p style={{fontSize: "13px", textAlign: "left", color: "#6c8080"}}> {errors.appraisal_type && errors.appraisal_type.message}</p></Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col><Form.Label>Increment value</Form.Label></Col>
                    <Col><Form.Control type="tel" style={{background: "#FFFFFF"}} placeholder="" {...register("appraisal_value",{required: {value: true, message: "Increment value is requried"}, minLength: {value: 1, message: "Minimum 1 digits required"}})}/> <p style={{fontSize: "13px", textAlign: "left", color: "#6c8080"}}> {errors.appraisal_value && errors.appraisal_value.message}</p></Col>
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
                    <Col className='text-end'><Button type='submit' className='w-100'>Confirm</Button></Col>
                </Row>
            </Form>       
        </Modal.Body>
    </>
  )
}

export default EmployeeIncrementModal