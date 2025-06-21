import React, {useContext, useEffect, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import ModalFooter from 'react-bootstrap/esm/ModalFooter';
import PayrollContext from '../../context/payrollContext';
import { deleteTypeEnum } from '../../constValue';
import { deleteEmployee } from '../../services/employeeService';
import { deleteSalaryReport } from '../../services/dashboardService';
import { deleteAdvanceSalary } from '../../services/salaryService';
import { deleteLoan } from '../../services/loanService';
import Spinner from 'react-bootstrap/esm/Spinner';

const DeleteModal = (props) => {
    const data = props.modalData;
    const type = props.deleteType;
    const handleClose = props.handleClose;
    const [modalContent, setModalContent] = useState({
        title: "",
        label: ""

    });
    const [loading, setLoading] = useState(false);
    const context = useContext(PayrollContext);
    const {setAlertData, setAlertShow, setAlertVariant, setModalShow, setRefresh} = context;
    const handleDelete = async(payload) => {
        let responseSuccess, responseMessage;
        setLoading(true);
        if(type === deleteTypeEnum.salary_detial){
            const {success, status, data, message} = await deleteSalaryReport(payload);
            responseSuccess = success;
            responseMessage = message;
        }
        if(type === deleteTypeEnum.employee_detail){
            const {success, status, data, message} = await deleteEmployee(payload);
            responseSuccess = success;
            responseMessage = message;
        }
        if(type === deleteTypeEnum.advance_salary){
            const {success, status, data, message} = await deleteAdvanceSalary(payload);
            responseSuccess = success;
            responseMessage = message;
        }
        if(type === deleteTypeEnum.loan){
            const {success, status, data, message} = await deleteLoan(payload);
            responseSuccess = success;
            responseMessage = message;
        }
        if(!responseSuccess) {
            setAlertVariant("danger");
        }
        else{
            setAlertVariant("success");
            setRefresh(true);
        }
        setLoading(false);
        setAlertShow(true);
        setAlertData(responseMessage);
        setModalShow(false);
    }

    useEffect(()=>{
        if(type === deleteTypeEnum.salary_detial){
            setModalContent({
                title: "Delete salary report",
                label: `Are you sure, you want to delete salary report for ${data?.month}-${data?.year}?`
            })
        }
        if(type === deleteTypeEnum.employee_detail){
            setModalContent({
                title: "Delete employee",
                label: `Are you sure, you want to delete employee ${data?.employeeId}?`
            })
        }
        if(type === deleteTypeEnum.advance_salary){
            setModalContent({
                title: "Delete advance salary",
                label: `Are you sure, you want to delete advance salary of ${data?.employeeId} for ${data?.date}?`
            })
        }
        if(type === deleteTypeEnum.loan){
            setModalContent({
                title: "Delete loan",
                label: `Are you sure, you want to delete loan of ${data?.employeeId} for ${data?.date}?`
            })
        }
    }, [])
  return (
    <>
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                {modalContent.title}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Row className="mb-3">
                <Col><Form.Label>{modalContent.label}</Form.Label></Col>
            </Row>
        </Modal.Body>
        <ModalFooter>
            <Row className="mb-3">
                <Col>
                    <Row>
                        <Col>
                        {loading && <Spinner animation="border" role="status" variant="danger">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>}
                        </Col>
                        <Col><Button variant='danger' type='submit' onClick={()=>handleDelete(data._id)}>Delete</Button></Col>
                        <Col><Button onClick={()=>{handleClose()}}>Cancle</Button></Col>
                    </Row>
                </Col>
            </Row>
        </ModalFooter>     
    </>
  )
}

export default DeleteModal;