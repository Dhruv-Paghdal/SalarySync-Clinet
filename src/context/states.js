import React, {useState} from 'react';
import PayrollContext from "./payrollContext";
import { loginEnum, modalTypeEnum, deleteTypeEnum } from '../constValue';

const States = (props) => {
  const [loginCard, setLoginCard] = useState(loginEnum.login);
  const [modalType, setModalType] = useState(modalTypeEnum.detail);
  const [deleteType, setDeleteType] = useState(deleteTypeEnum.salary_detial);
  const [modalShow, setModalShow] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [alertShow, setAlertShow] = useState(false);
  const [alertData, setAlertData] = useState("");
  const [filterPayload, setFilterPayload] = useState({page: 1, row: 5, search: {}});
  const [alertVariant, setAlertVariant] = useState("danger");
  const [refresh, setRefresh] = useState(false);
  return (
    <PayrollContext.Provider value={{loginCard, setLoginCard, modalType, setModalType, modalShow, setModalShow, modalData, setModalData, alertVariant, setAlertVariant, alertShow, setAlertShow, alertData, setAlertData, filterPayload, setFilterPayload, refresh, setRefresh, deleteType, setDeleteType}}>
      {props.children}
    </PayrollContext.Provider>
  )
}

export default States;