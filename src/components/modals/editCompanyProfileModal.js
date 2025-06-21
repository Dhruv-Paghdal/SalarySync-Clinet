import React, {useEffect, useState, useContext} from 'react';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button'; 
import { PlusLg, DashLg } from 'react-bootstrap-icons'
import PayrollContext from '../../context/payrollContext';
import {useForm} from "react-hook-form";
import { editCompanyProfile } from '../../services/profileService';
import Spinner from 'react-bootstrap/esm/Spinner';

const EditCompanyProfileModal = (props) => {
  const companyData = props.modalData;
  const [loading, setLoading] = useState(false);
  const [ownerDetailArray, setOwnerDetailArray] = useState([{ name: "", mobile: "", email: ""}]);
  const {register, formState: {errors}, handleSubmit} = useForm({
    defaultValues: {
      "company_name": companyData?.companyName?.trim(),
      "mobile": companyData?.mobile?.trim(),
      "company_code": companyData?.companyCode?.trim(),
      "company_address.addressLine": companyData?.companyAddress?.addressLine,
      "company_address.landmark": companyData?.companyAddress?.landmark,
      "company_address.city": companyData?.companyAddress?.city,
      "company_address.state": companyData?.companyAddress?.state,
      "company_address.country": companyData?.companyAddress?.country,
      "company_address.zipCode": companyData?.companyAddress?.zipCode,
      "working_year": companyData?.workingYear,
      "week_off_day": companyData?.weekOffDay ? companyData.weekOffDay.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(", "): "",
    }
  });
  const context = useContext(PayrollContext);
  const {setAlertData, setAlertShow, setAlertVariant, setModalShow, setRefresh} = context;
  const onSubmit = async(payload) => {
    setLoading(true);
    if(!payload.company_name) {
      payload["company_name"] = " "
    }
    if(!payload.mobile) {
      payload["mobile"] = " "
    }
    if(!payload.company_code) {
      payload["company_code"] = " "
    }
    if(!payload.week_off_day) {
      payload["week_off_day"] = []
    }
    payload["owner_detail"] = ownerDetailArray;
    const {success, status, data, message} = await editCompanyProfile(payload);
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
    setLoading(false);
  }
  useEffect(()=>{
    if(companyData?.ownerDetail?.length) {
      const ary = [];
      for (const owner of companyData?.ownerDetail) {
       ary.push({name: owner?.name,
        mobile: owner?.mobile,
        email: owner?.email})
      }
      setOwnerDetailArray(ary);
    }
  }, []);
  const handleAdd = () => {
    setOwnerDetailArray([...ownerDetailArray, { name: "", mobile: "", email: "" }])
  }
  const handleChange = (index, e) => {
    const newFormValues = [...ownerDetailArray];
    newFormValues[index][e.target.name] = e.target.value;
    setOwnerDetailArray(newFormValues);
  }
  const handleRemove = (index) => {
    const newFormValues = [...ownerDetailArray];
    newFormValues.splice(index, 1);
    setOwnerDetailArray(newFormValues)
  }
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
            Edit profile
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{height: "75vh", overflowX: "hidden"}}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="mb-3">
              <Col lg={true}><Form.Label>Company name</Form.Label></Col>
              <Col lg={true}><Form.Control type="text" style={{background: "#FFFFFF"}} {...register("company_name")}/></Col>
          </Row>
          <Row className="mb-3">
              <Col lg={true}><Form.Label>Company code</Form.Label></Col>
              <Col lg={true}><Form.Control type="text" style={{background: "#FFFFFF"}} placeholder="" {...register("company_code")}/></Col>
          </Row>
          <Row className="mb-3">
              <Col lg={true}><Form.Label>Company mobile</Form.Label></Col>
              <Col lg={true}><Form.Control type="tel" style={{background: "#FFFFFF"}} placeholder="" {...register("mobile")}/></Col>
          </Row>
          <Row className="mb-3">
              <Col lg={true}><Form.Label>Working year</Form.Label></Col>
              <Col lg={true}><Form.Control type="text" style={{background: "#FFFFFF"}} placeholder="" {...register("working_year")}/></Col>
          </Row>
          <Row className="mb-3">
              <Col lg={true}><Form.Label>Week off day</Form.Label></Col>
              <Col lg={true}><Form.Control type="text" style={{background: "#FFFFFF"}} placeholder="Enter Value Seperated by ," {...register("week_off_day", {
      setValueAs: (value) => 
        value
          ? value.split(",").map(day => day.trim().toLowerCase())
          : []
    })}/></Col>
          </Row>
          <hr />
          <Row>
            <Col lg={true}><Form.Label>Address</Form.Label></Col>
          </Row>
          <Row >
            <Col lg={true} className="mb-3">
              <Row>
                <Col>
                  <Form.Label>Plot, Shop no., Building</Form.Label>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Control type="text" style={{background: "#FFFFFF"}} placeholder="" {...register("company_address.addressLine")}/>
                </Col>
              </Row>
            </Col>
            <Col lg={true} className="mb-3">
              <Row>
                <Col>
                  <Form.Label>Landmark</Form.Label>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Control type="text" style={{background: "#FFFFFF"}} placeholder="" {...register("company_address.landmark")}/>
                </Col>
              </Row>
            </Col>
            <Col lg={true} className="mb-3">
              <Row>
                <Col>
                  <Form.Label>City / Village</Form.Label>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Control type="text" style={{background: "#FFFFFF"}} placeholder="" {...register("company_address.city")}/>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col lg={true} className="mb-3">
              <Row>
                <Col>
                  <Form.Label>State</Form.Label>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Control type="text" style={{background: "#FFFFFF"}} placeholder="" {...register("company_address.state")}/>
                </Col>
              </Row>
            </Col>
            <Col lg={true} className="mb-3">
              <Row>
                <Col>
                  <Form.Label>Country</Form.Label>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Control type="text" style={{background: "#FFFFFF"}} placeholder="" {...register("company_address.country")}/>
                </Col>
              </Row>
            </Col>
            <Col lg={true} className="mb-3">
              <Row>
                <Col>
                  <Form.Label>Pincode</Form.Label>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Control type="text" style={{background: "#FFFFFF"}} placeholder="" {...register("company_address.zipCode")}/>
                </Col>
              </Row>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col><Form.Label>Owner detail</Form.Label></Col>
            <Col className='text-end'><h4><PlusLg style={{fontSize: "23px"}} className='hoverEffect' onClick={()=>handleAdd()}/></h4></Col>
          </Row>
          {
            ownerDetailArray.map((data,index) => (
               <Row  key={index}>
                  <Col lg={true} className="mb-3">
                    <Row>
                      <Col>
                        <Form.Label>Name</Form.Label>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Control type="text" style={{background: "#FFFFFF"}} placeholder="" value={data.name || ""} name="name" onChange={e => handleChange(index, e)}/>
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={true} className="mb-3">
                    <Row>
                      <Col>
                        <Form.Label>Mobile</Form.Label>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Control type="tel" style={{background: "#FFFFFF"}} name="mobile" placeholder="" value={data.mobile || ""} onChange={e => handleChange(index, e)}/>
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={true} className="mb-3">
                    <Row>
                      <Col>
                        <Row>
                          <Form.Label>
                            <Row>
                              <Col>Email</Col>
                              <Col className='text-end'><DashLg style={{fontSize: "23px"}} className='hoverEffect' onClick={()=>handleRemove(index)}/></Col>
                            </Row>
                          </Form.Label>
                        </Row>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Control type="email" style={{background: "#FFFFFF"}} name="email" placeholder="" value={data.email || ""} onChange={e => handleChange(index, e)}/>
                      </Col>
                    </Row>
                  </Col>
              </Row>
            ))
          }
          <Row className='my-2'>
            <Col>
            {loading && <div className='text-center'>
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>}
            </Col>
          </Row>
          <Row>
              <Col lg={true}><Button type='submit' className='w-100'>Edit</Button></Col>
          </Row>
        </Form>       
      </Modal.Body>
    </>
  )
}

export default EditCompanyProfileModal;

