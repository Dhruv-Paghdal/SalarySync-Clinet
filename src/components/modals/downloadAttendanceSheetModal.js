import React, {useContext, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import { useForm } from "react-hook-form";
import { attendaneSheetDownload } from '../../services/dashboardService';
import PayrollContext from '../../context/payrollContext';
import * as XLSX from 'xlsx';
import Spinner from 'react-bootstrap/esm/Spinner';

const DownloadAttendanceSheetModal = () => {
    const context = useContext(PayrollContext);
    const {setAlertData, setAlertShow, setAlertVariant, setModalShow} = context;
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }} = useForm();
    const onSubmit = async(payload) => {
        setLoading(true);
        const { success, status, data, message} = await attendaneSheetDownload(payload);
        if(!success) {
            setAlertVariant("danger");
            setAlertShow(true);
            setAlertData(message);
            setModalShow(false);
        }
        else{
            const sheetData = XLSX.utils.json_to_sheet(data[0].list);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, sheetData, `${data[0].month}-${data[0].year}`);
            XLSX.writeFile(workbook,`ATTENDANCE_SHEET_${data[0].month}.xlsx`);
            setModalShow(false);
        }
        setLoading(false);
    }
  return (
    <>
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                Download attendance sheet
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row className="mb-3">
                    <Col><Form.Label>Month</Form.Label></Col>
                    <Col><Form.Control type="number" style={{background: "#FFFFFF"}} placeholder="" {...register("month", {required: {value: true, message: "Month is required"}, min: {value: 1, message: "Invalid month"}, max: {value:12, message: "Invalid month"}, minLength: {value:1, message: "Invalid month"}, maxLength: {value: 2, message: "Invalid month"}})}/> <p className="pt-2 mb-0" style={{fontSize: "13px", textAlign: "left", color: "#6c8080"}}> {errors.month && errors.month.message}</p></Col>
                </Row>
                <Row>
                    <Col><Form.Label>Year</Form.Label></Col>
                    <Col><Form.Control type="number" style={{background: "#FFFFFF"}} placeholder="" {...register("year", {required: {value: true, message: "Year is required"}, min: {value: 1000, message: "Invalid year"}, max: {value:9999, message: "Invalid year"}, minLength: {value:4, message: "Invalid year"}, maxLength: {value: 4, message: "Invalid year"}})}/> <p className="pt-2 mb-0" style={{fontSize: "13px", textAlign: "left", color: "#6c8080"}}> {errors.year && errors.year.message}</p> </Col>
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
                    <Col className='text-end'><Button type='submit' className='w-100'>Download</Button></Col>
                </Row>
            </Form>       
        </Modal.Body>
    </>
  )
}

export default DownloadAttendanceSheetModal