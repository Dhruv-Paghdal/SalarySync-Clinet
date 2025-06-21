import React,{useContext} from 'react'
import Modal from 'react-bootstrap/Modal';
import SalaryDetailModal from './modals/salaryDetailModal';
import DownloadAttendanceSheetModal from './modals/downloadAttendanceSheetModal';
import CalculateSalaryModal from './modals/calculateSalaryModal';
import AddAdvanceSalaryModal from './modals/addAdvanceSalaryModal';
import SearchFilterModal from './modals/searchFilterModal';
import EditAdvanceSalaryModal from './modals/editAdvanceSalaryModal';
import AddLoanModal from './modals/addLoanModal';
import EditLoanModal from './modals/editLoanModal';
import AddEmployeeModal from './modals/addEmployeeModal';
import EmployeeDetailModal from './modals/employeeDetailModal';
import EditEmployeeModal from './modals/editEmployeeModal';
import DeleteModal from './modals/deleteModal';
import EmployeeIncrementModal from './modals/employeeIncrementModal';
import EditCompanyProfileModal from './modals/editCompanyProfileModal';
import PayrollContext from '../context/payrollContext';
import { modalTypeEnum } from '../constValue';
import "./css/modal.css"

const AppModal = () => {
  const context = useContext(PayrollContext);
  const {modalType, modalShow, setModalShow, modalData, deleteType} = context;
  const handleClose = () => {
    setModalShow(false)
  };
  return (
    <Modal
      show={modalShow}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      onHide={handleClose}
    >
      {(modalType === modalTypeEnum.detail) && <SalaryDetailModal modalData={modalData}/>}
      {(modalType === modalTypeEnum.attendance) && <DownloadAttendanceSheetModal />}
      {(modalType === modalTypeEnum.calculate_salary) && <CalculateSalaryModal />}
      {(modalType === modalTypeEnum.advance_salary) && <AddAdvanceSalaryModal />}
      {(modalType === modalTypeEnum.edit_advance_salary) && <EditAdvanceSalaryModal modalData={modalData}/>}
      {(modalType === modalTypeEnum.loan) && <AddLoanModal />}
      {(modalType === modalTypeEnum.edit_loan) && <EditLoanModal modalData={modalData}/>}
      {(modalType === modalTypeEnum.add_employee) && <AddEmployeeModal />}
      {(modalType === modalTypeEnum.employee_detail) && <EmployeeDetailModal modalData={modalData}/>}
      {(modalType === modalTypeEnum.edit_employee) && <EditEmployeeModal modalData={modalData}/>}
      {(modalType === modalTypeEnum.delete_data) && <DeleteModal modalData={modalData} handleClose={handleClose} deleteType={deleteType}/>}
      {(modalType === modalTypeEnum.employee_increment) && <EmployeeIncrementModal individual={true} modalData={modalData}/>}
      {(modalType === modalTypeEnum.all_employee_increment) && <EmployeeIncrementModal individual={false}/>}
      {(modalType === modalTypeEnum.search_filter) && <SearchFilterModal showDate={false}/>}
      {(modalType === modalTypeEnum.date_search_filter) && <SearchFilterModal showDate={true}/>}
      {(modalType === modalTypeEnum.edit_company_profile) && <EditCompanyProfileModal modalData={modalData}/>}
    </Modal>
  )
}

export default AppModal;