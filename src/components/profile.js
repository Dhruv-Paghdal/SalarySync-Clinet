import React, {useContext, useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import {PersonGear} from 'react-bootstrap-icons';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Form from 'react-bootstrap/Form';
import moment from 'moment';
import AppModal from './modal';
import PayrollContext from '../context/payrollContext';
import { modalTypeEnum } from '../constValue';
import { companyProfile } from '../services/profileService';
import Placeholder from 'react-bootstrap/Placeholder';

const Profile = () => {
    const context = useContext(PayrollContext);
    const { setModalShow, setModalType, setModalData,  setAlertData, setAlertShow, setAlertVariant, setFilterPayload, refresh, setRefresh, filterPayload} = context;
    const [data, setData] = useState({});
    const handleModal = (type) => {
      setModalData(data)
      setModalType(type);
      setModalShow(true);
    }  
    useEffect(() => {
      (async()=>{
        const { success, data, message } = await companyProfile(filterPayload);
        if (!success) {
          setAlertVariant("danger");
          setAlertShow(true);
          setAlertData(message);
        } else {
          if (data._id) {
            setData(data);
          } else {
            setData({});
          }
        }
      })()
      setRefresh(false);
      setFilterPayload({page: 1, row: 5, search: {}});
    }, [refresh])

  return (
    (data && data?._id) ? <>
      <div className='m-2 p-3 layoutContentCard' style={{background: "#FFFFFF", borderRadius: "15px"}}>
        <div className='content-flex'>
            <div>
                <h3 className='navbarTitle'>{data?.companyName?.toUpperCase()}</h3>
                <p>Here's your profile</p>
            </div>
            <div>
              <Button className='w-100' onClick={()=>handleModal(modalTypeEnum.edit_company_profile)}><PersonGear /> Edit profile</Button>
            </div>
        </div>
        <hr />
        <div>
          <Row>
            <Col lg={true} className='mb-4'>
              <h6>Email</h6>
              <Form.Control type="text" disabled placeholder="" value={data?.email}/>
            </Col>
            <Col lg={true} className='mb-4'>
              <h6>Mobile</h6>
              <Form.Control type="text" disabled placeholder="" value={data?.mobile}/>
            </Col>
            <Col lg={true} className='mb-4'>
              <h6>Company code</h6>
              <Form.Control type="text" disabled placeholder="" value={data?.companyCode}/>
            </Col>
          </Row>
          <Row>
            <Col lg={true} className='mb-4'>
              <h6>Working year</h6>
              <Form.Control type="text" disabled placeholder="" value={data?.workingYear}/>
            </Col>
            <Col lg={true} className='mb-4'>
              <h6>Subscription due date</h6>
              <Form.Control type="text" disabled placeholder="" value={moment.utc(data?.endDate).format("MM-DD-YYYY")}/>
            </Col>
            <Col lg={true} className='mb-4'>
              <h6>Status</h6>
              <Form.Control type="text" className={`text-${data?.isActive ? "success" : "danger"}`} style={{fontWeight: "bold"}} disabled placeholder="" value={data?.isActive ? "Active" : "Expired"}/>
            </Col>
          </Row>
          <Row>
            <Col lg={true} className='mb-4'>
              <h6>Company address</h6>
              <div style={{height: "130px", overflowX: "hidden", background: "#e9ecef", opacity: 1, padding: "0.375rem 0.75rem", fontSize: "1rem", fontWeight: "400", lineHeight: "1.5", color: "var(--bs-body-color)", border: "var(--bs-border-width) solid var(--bs-border-color)", borderRadius: "var(--bs-border-radius)"}}>
                {data?.companyAddress?.addressLine && <div className='mb-1'>{data?.companyAddress?.addressLine}, </div>}
                {data?.companyAddress?.landmark && <div className='mb-1'>{data?.companyAddress?.landmark}, </div>}
                {(data?.companyAddress?.city || data?.companyAddress?.state) && <div className='mb-1'>{data?.companyAddress?.city}, {data.companyAddress?.state}</div>}
                {(data?.companyAddress?.zipCode || data?.companyAddress?.country) && <div className='mb-1'>{data?.companyAddress?.country}, {data?.companyAddress?.zipCode}</div>}
              </div>
            </Col>
            <Col lg={true} className='mb-4'>
            <h6>Subscription history</h6>
              <div style={{height: "130px", overflowX: "hidden", background: "#e9ecef", opacity: 1, padding: "0.375rem 0.75rem", fontSize: "1rem", fontWeight: "400", lineHeight: "1.5", color: "var(--bs-body-color)", border: "var(--bs-border-width) solid var(--bs-border-color)", borderRadius: "var(--bs-border-radius)"}}>
                {data?.subscriptionHistory && data?.subscriptionHistory?.map((data, index)=>{
                  return <div className='mb-1' key={index}>{data}</div>
                })}
              </div>
            </Col>
            <Col lg={true} className='mb-4'>
              <h6>Week off day</h6>
              <Form.Control type="text" disabled placeholder="" value={data?.weekOffDay && data?.weekOffDay?.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(", ")}/>
            </Col>
          </Row>
          <Row>
            <Col lg={true} className='mb-1'>
              <h6>Owner detail</h6>
              <div style={{height: "150px", overflowX: "hidden", background: "#e9ecef", opacity: 1, padding: "0.375rem 0.75rem", fontSize: "1rem", fontWeight: "400", lineHeight: "1.5", color: "var(--bs-body-color)", border: "var(--bs-border-width) solid var(--bs-border-color)", borderRadius: "var(--bs-border-radius)"}}>
              <ol>{data?.ownerDetail && data?.ownerDetail.map((data) => {
                  return<li className='mb-2' key={data._id}>
                      <>
                        <div>Name: {data?.name}</div>
                        <div>Mobile: {data?.mobile}</div>
                        <div>Email: {data?.email}</div>
                      </>
                    </li>
                })}</ol>
              </div>
            </Col>
          </Row>
        </div>
        <AppModal />
      </div>
    </>
    : <>
      <div className='m-2 p-3 layoutContentCard' style={{background: "#FFFFFF", borderRadius: "15px"}}>
        <div className='content-flex'>
          <div>
          <Placeholder as={Form.Control} style={{"backgroundColor": "#e9ecef"}} animation="wave" />
            <p>Here's your profile</p>
          </div>
          <div>
            <Button className='w-100' onClick={()=>handleModal(modalTypeEnum.edit_company_profile)}><PersonGear /> Edit profile</Button>
          </div>
        </div>
        <hr />
        <div>
          <Row>
            <Col lg={true} className='mb-4'>
              <h6>Email</h6>
              <Placeholder as={Form.Control} style={{"backgroundColor": "#e9ecef"}} animation="wave" />
            </Col>
            <Col lg={true} className='mb-4'>
              <h6>Mobile</h6>
              <Placeholder as={Form.Control} style={{"backgroundColor": "#e9ecef"}} animation="wave" />
            </Col>
            <Col lg={true} className='mb-4'>
              <h6>Company code</h6>
              <Placeholder as={Form.Control} style={{"backgroundColor": "#e9ecef"}} animation="wave" />
            </Col>
          </Row>
          <Row>
            <Col lg={true} className='mb-4'>
              <h6>Working year</h6>
              <Placeholder as={Form.Control} style={{"backgroundColor": "#e9ecef"}} animation="wave" />
            </Col>
            <Col lg={true} className='mb-4'>
              <h6>Subscription due date</h6>
              <Placeholder as={Form.Control} style={{"backgroundColor": "#e9ecef"}} animation="wave" />
            </Col>
            <Col lg={true} className='mb-4'>
              <h6>Status</h6>
              <Placeholder as={Form.Control} style={{"backgroundColor": "#e9ecef"}} animation="wave" />
            </Col>
          </Row>
          <Row>
            <Col lg={true} className='mb-4'>
              <h6>Company address</h6>
              <Placeholder as={"div"} style={{"backgroundColor": "#e9ecef", "height": "130px", "borderRadius": "0.375rem"}} animation="wave" />
            </Col>
            <Col lg={true} className='mb-4'>
            <h6>Subscription history</h6>
            <Placeholder as={"div"} style={{"backgroundColor": "#e9ecef", "height": "130px", "borderRadius": "0.375rem"}} animation="wave" />
            </Col>
            <Col lg={true} className='mb-4'>
              <h6>Week off day</h6>
              <Placeholder as={Form.Control} style={{"backgroundColor": "#e9ecef"}} animation="wave" />
            </Col>
          </Row>
          <Row>
            <Col lg={true} className='mb-1'>
              <h6>Owner detail</h6>
              <Placeholder as={"div"} style={{"backgroundColor": "#e9ecef", "height": "150px", "borderRadius": "0.375rem"}} animation="wave" />
            </Col>
          </Row>
        </div>
        <AppModal />
      </div>
    </>
  ) 
}

export default Profile

