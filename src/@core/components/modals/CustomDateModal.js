import React, { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { handleFilterData } from "../../../redux/filterData"
// ** Reactstrap Imports
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Row,
  Col,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import { Calendar, X, Clock, Plus, UserX } from "react-feather";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
const CustomDateModal = ({ formModal, setFormModal, filteredData }) => {

  const dispatch = useDispatch()

  // ** Formate Date
  function formateDate(date = new Date()) {
    const offset = new Date(date).getTimezoneOffset()
    date = new Date(new Date(date).getTime() - offset * 60 * 1000)

    const formattedDate = new Date(date).toISOString().split("T")[0]

    return formattedDate
  }

  const [formData, setFormData] = useState({
    startDate: formateDate(new Date()),
    endDate: formateDate(new Date())
  })
  
  const handleDate = (date, arg) => {
    setFormData((oldList) => {
      const newList = { ...oldList }
      newList[arg] = formateDate(date)
      return newList
    })
  }

  const handleFilter = (e) => {

    setFormModal(!formModal)

    let dataFiltered = []
    
    dataFiltered = filteredData?.filter(
      (item) => item.date >= formData.startDate && item.date <= formData.endDate
    )

    dispatch(handleFilterData(dataFiltered))
  }

  useEffect(() => {
    
  }, [formData])


  return (
    <div>
      <Modal
        isOpen={formModal}
        toggle={() => setFormModal(!formModal)}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={() => setFormModal(!formModal)}>
          Select Custom Date
        </ModalHeader>
        <ModalBody>
          <div className="mb-2">
            <Row>
              <Col md="6" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="startDate">
                    Start Date
                  </Label>
                  <InputGroup>
                    <InputGroupText>
                      <Calendar size={15} />
                    </InputGroupText>
                    <Flatpickr
                      className="form-control"
                      id="startDate"
                      value={formData.startDate}
                      onChange={(date) => {
                        handleDate(date, 'startDate')
                      }}
                    />
                  </InputGroup>
                </div>
              </Col>
              <Col md="6" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="endDate">
                    End Date
                  </Label>
                  <InputGroup>
                    <InputGroupText>
                      <Calendar size={15} />
                    </InputGroupText>
                    <Flatpickr
                      className="form-control"
                      id="endDate"
                      value={formData.endDate}
                      onChange={(date) => {
                        handleDate(date, 'endDate')
                      }}
                    />
                  </InputGroup>
                </div>
              </Col>
            </Row>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={(e) => handleFilter(e)}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CustomDateModal;
