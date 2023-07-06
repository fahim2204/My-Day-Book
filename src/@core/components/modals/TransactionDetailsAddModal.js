// ** React Imports
import React,{ useState, useEffect } from "react"

// ** Third Party Components
import Flatpickr from "react-flatpickr"
import { Calendar, X, Clock, Plus, UserX } from "react-feather"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const MySwal = withReactContent(Swal)
// ** Reactstrap Imports
import {
  Modal,
  Input,
  Label,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
  InputGroup,
  InputGroupText,
  Row,
  Col,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap"

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss"
import {
  storeBookTransactionData,
  updateBookTransaction,
  CreateNewCategory,
  CreateNewContact,
  disableContactById,
} from "@apifile";
import Select from "react-select";
import { selectThemeColors } from "@utils";

const TransactionDetailsAddModal = ({
  open,
  handleModal,
  pageData,
  transType,
  fetchData,
  editData,
  contactsForModal
}) => {
  // ** Formate Date
  function formateDate(date = new Date()) {
    const offset = new Date(date).getTimezoneOffset()
    date = new Date(new Date(date).getTime() - offset * 60 * 1000)

    const formattedDate = new Date(date).toISOString().split("T")[0]

    return formattedDate
  }

  // ** Formate Time
  function formateTime(time = new Date()) {
    const formattedtime = new Date(time).toLocaleTimeString("en-US", {
      hour12: false,
      hour: "numeric",
      minute: "numeric"
    })

    return formattedtime
  }

  // ** State
  const [formModal, setFormModal] = useState(false)
  const [formContactModal, setFormContactModal] = useState(false)
  const [Picker, setPicker] = useState(new Date())
  const [basic, setBasic] = useState(new Date())
  const [formData, setFormData] = useState({
    amount: 0,
    contact_type_id: "",
    contact_type_name: "Select",
    date: Picker,
    time: basic,
    book_contact_id: "",
    book_contact_name: "Select",
    transaction_category_id: "",
    transaction_category_name: "Select",
    payment_method_id: "2",
    payment_method_name: "Cash",
    book_id: "",
    type: transType,
    description: "",
    page_no: ""
  })

  const [customModal, setCustomModal] = useState({
    category_name: "",
    business_id: "",
    contact_name: "",
    book_id: "",
    primary_number: "",
    secondary_number: "",
    remarks: "",
    supllier_files: [],
    contact_type_id: "",
    contact_type_name: "Select"
  })

  const [selectedFiles, setSelectedFiles] = useState([])
  const [selectedOptions, setSelectedOptions] = React.useState([]);
  const handleFileSelect = (event) => {
    // setSelectedFiles([...selectedFiles, ...event.target.files]);
    setSelectedFiles(event.target.files)
  }

  // ** Custom close btn
  const CloseBtn = (
    <X className="cursor-pointer" size={15} onClick={() => handleModal("")} />
  )

  // ** Select2 Handle
  const handleSelectChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
  };

  const handleDate = (date) => {
    setPicker(date)
    setFormData((oldList) => {
      const newList = { ...oldList }
      newList.date = formateDate(date)
      console.log(newList.date)
      return newList
    })
  }

  const handleTime = (date) => {
    setBasic(date)
    setFormData((oldList) => {
      const newList = { ...oldList }
      newList.time = formateTime(date)
      return newList
    })
  }

  const sectionLevelEdit = (e, fieldName) => {
    setFormData((oldList) => {
      const newList = JSON.parse(JSON.stringify(oldList))
      const getField = fieldName.dlevel
      newList[getField] = fieldName.f_val
      newList.date = formateDate(Picker)
      newList.time = formateTime(basic)
      newList.book_id = pageData?.bookId
      newList.type = transType
      if (
        getField === "contact_type_id" ||
        // getField === "book_contact_id" ||
        getField === "transaction_category_id" ||
        getField === "payment_method_id"
      ) {
        const getField_name = fieldName.dlevel_name
        newList[getField_name] = fieldName.t_val
      }

      return newList
    })
  }

  const handleCategoryChange = (e, fieldName) => {
    setCustomModal((oldList) => {
      const newList = JSON.parse(JSON.stringify(oldList))
      const getField = fieldName.dlevel
      newList[getField] = fieldName.f_val
      newList.business_id = pageData?.businessId
      newList.book_id = pageData?.bookId
      return newList
    })
  }

  const handleFormSubmit = (e) => {
    if (
      formData.amount === 0 || formData.book_id === "" ||
      formData.type === "" || formData.date === ""
    ) {
      MySwal.fire({
        title: "Warning!",
        text: " Please select required fields!",
        icon: "warning",
        customClass: {
          confirmButton: "btn btn-primary"
        },
        buttonsStyling: false
      });
      return false
    }

    if (editData.edit) {
      // console.log("eidt checl",formData)
      // return false;

      updateBookTransaction(formData, editData.id)
        .then((res) => {
          if (res.status === 200) {
            MySwal.fire({
              title: "success!",
              text: "Your Transaction update successfully!",
              icon: "success",
              customClass: {
                confirmButton: "btn btn-primary"
              },
              buttonsStyling: false,
              timerProgressBar: true,
              timer: 2000
            })

            handleModal("")
            setFormData({
              amount: 0,
              contact_type_id: "",
              contact_type_name: "Select",
              date: new Date(),
              time: new Date(),
              book_contact_id: "",
              book_contact_name: "Select",
              transaction_category_id: "",
              transaction_category_name: "Select",
              payment_method_id: "2",
              payment_method_name: "Cash",
              book_id: "",
              type: transType,
              description: ""
            })

            fetchData()
          }
        })
        .catch((err) => err)
    } else {
      storeBookTransactionData(formData)
        .then((res) => {
          if (res.status === 200) {
            MySwal.fire({
              title: "success!",
              text: "Your Transaction update successfully!",
              icon: "success",
              customClass: {
                confirmButton: "btn btn-primary"
              },
              buttonsStyling: false,
              timerProgressBar: true,
              timer: 2000
            })

            handleModal("")
            setFormData({
              amount: 0,
              contact_type_id: "",
              contact_type_name: "Select",
              date: new Date(),
              time: new Date(),
              book_contact_id: "",
              book_contact_name: "Select",
              transaction_category_id: "",
              transaction_category_name: "Select",
              payment_method_id: "2",
              payment_method_name: "Cash",
              book_id: "",
              type: transType,
              description: ""
            })

            fetchData()
          }
        })
        .catch((err) => err)
    }

    editData.edit = false
  }

  const handleCategoryCreate = () => {
    if (customModal.category_name === "" && formModal === true) {
      MySwal.fire({
        title: "Warning!",
        text: " Please select required fields!",
        icon: "warning",
        customClass: {
          confirmButton: "btn btn-primary"
        },
        buttonsStyling: false
      });
      return false
    }
    CreateNewCategory(customModal)
      .then((res) => {
        if (res.status === 200) {
          MySwal.fire({
            title: "success!",
            text: "Your Transaction saved successfully!",
            icon: "success",
            customClass: {
              confirmButton: "btn btn-primary"
            },
            buttonsStyling: false,
            timerProgressBar: true,
            timer: 2000
          })

          fetchData()
          setCustomModal({
            category_name: "",
            business_id: "",
            contact_name: "",
            book_id: "",
            primary_number: "",
            secondary_number: "",
            remarks: "",
            supllier_files: [],
            contact_type_id: "",
            contact_type_name: "Select"
          });
          setFormModal(!formModal)
        }
      })
      .catch((err) => err)
  }

  const handleContactCreate = () => {
    if (
      (customModal.contact_name === "" || customModal.primary_number === "") &&
      formContactModal === true
    ) {
      MySwal.fire({
        title: "Warning!",
        text: " Please select required fields!",
        icon: "warning",
        customClass: {
          confirmButton: "btn btn-primary"
        },
        buttonsStyling: false
      })
      return false
    }
    const formData = new FormData()
    for (let file of selectedFiles) {
      formData.append("files[]", file)
    }
    formData.append("contact_name", customModal.contact_name)
    formData.append("book_id", customModal.book_id)
    formData.append("business_id", customModal.business_id)
    formData.append("contact_type_id", customModal.contact_type_id)
    formData.append("primary_number", customModal.primary_number)
    formData.append("secondary_number", customModal.secondary_number)
    formData.append("remarks", customModal.remarks)
    // return false;
    CreateNewContact(formData)
      .then((res) => {
        if (res.status === 200) {
          MySwal.fire({
            title: "success!",
            text: "Your contact saved successfully!",
            icon: "success",
            customClass: {
              confirmButton: "btn btn-primary",
            },
            buttonsStyling: false,
            timerProgressBar: true,
            timer: 2000
          })

          fetchData()
          setCustomModal({
            category_name: "",
            business_id: "",
            contact_name: "",
            book_id: "",
            primary_number: "",
            secondary_number: "",
            remarks: "",
            supllier_files: []
          })
          setFormContactModal(!formContactModal)
        }
      })
      .catch((err) => err)
  }

  const handleContactDisable = (cont_id) => {
    disableContactById({ id: cont_id })
      .then((res) => {
        if (res.status === 200) {
          MySwal.fire({
            title: "success!",
            text: "Your contact disabled successfully!",
            icon: "success",
            customClass: {
              confirmButton: "btn btn-primary"
            },
            buttonsStyling: false,
            timerProgressBar: true,
            timer: 2000
          })

          setCustomModal({
            category_name: "",
            business_id: "",
            contact_name: "",
            book_id: "",
            primary_number: "",
            secondary_number: "",
            remarks: "",
            supllier_files: []
          })

          fetchData()
        }
      })
      .catch((err) => err)
  }

  useEffect(() => {
    if (editData?.edit) {
      setFormData({
        id: editData?.id,
        amount: editData?.amount,
        contact_type_id: editData?.contact_type_id,
        contact_type_name: editData?.contactTypeName,
        date: editData?.date,
        time: editData?.time,
        book_contact_id: editData?.book_contact_id,
        book_contact_name: editData?.contactName,
        transaction_category_id: editData?.transaction_category_id,
        transaction_category_name: editData?.transactionCategoryName,
        payment_method_id: editData?.payment_method_id,
        payment_method_name: editData?.methodName,
        book_id: editData?.book_id,
        type: transType,
        description: editData?.description,
        page_no: editData?.page_no
      })
    }
  }, [editData])

  return (
    <Modal
      isOpen={open}
      toggle={() => handleModal(transType)}
      className="sidebar-lg"
      modalClassName="modal-slide-in"
      contentClassName="pt-0"
    >
      <ModalHeader
        className="mb-1"
        toggle={() => handleModal(transType)}
        close={CloseBtn}
        tag="div"
      >
        <h5 className="modal-title">
          {transType === "Cash In" || transType === "Cash Out" ? "Edit" : "Add"}{" "}
          {transType === "cashIn" || transType === "Cash In"
            ? "Cash In"
            : "Cash Out"}{" "}
          Entry
        </h5>
      </ModalHeader>
      <ModalBody className="flex-grow-1">
        <Row>
          <Col md="6" sm="12">
            <div className="mb-1">
              <Label className="form-label" for="joining-date">
                Date
              </Label>
              <InputGroup>
                <InputGroupText>
                  <Calendar size={15} />
                </InputGroupText>
                <Flatpickr
                  className="form-control"
                  id="joining-date"
                  value={Picker}
                  onChange={(date) => handleDate(date)}
                />
              </InputGroup>
            </div>
          </Col>
          <Col md="6" sm="12">
            <div className="mb-1">
              <Label className="form-label" for="joining-date">
                Time
              </Label>
              <InputGroup>
                <InputGroupText>
                  <Clock size={15} />
                </InputGroupText>
                <Flatpickr
                  className="form-control"
                  id="timepicker"
                  value={basic}
                  options={{
                    enableTime: true,
                    noCalendar: true,
                    timeFormat: "H:i",
                    time_24hr: false
                  }}
                  onChange={(date) => handleTime(date)}
                />
              </InputGroup>
            </div>
          </Col>
        </Row>

        
        <div className="mb-1">
        
          <Label className="form-label d-block" for="full-name">
            Contact Name       <span onClick={(e) => {
                  e.preventDefault();
                  setFormContactModal(!formContactModal);
                }}> <Plus size={17}  style={{ marginLeft:"30px"}}/>Add</span>
          </Label>
          <Select
              theme={selectThemeColors}
              className="contact-select react-select"
              classNamePrefix="select"
              options={contactsForModal}
              isClearable={true}
              placeholder="Contact Name: "
              onChange={(e) =>
                sectionLevelEdit(e, {
                  dlevel: "book_contact_id",
                  f_val: e.value,
                })
              }
          />

<Modal
                isOpen={formContactModal}
                toggle={() => setFormModal(!formContactModal)}
                className="modal-dialog-centered"
              >
                <ModalHeader
                  toggle={() => setFormContactModal(!formContactModal)}
                >
                  Add New Contact
                </ModalHeader>
                <ModalBody>

                <div className="mb-1">
          <Label className="form-label d-block" for="full-name">
            Contact Type
          </Label>
          <UncontrolledButtonDropdown className="w-50">
            <Button outline color="primary">
              {formData.contact_type_name}
            </Button>
            <DropdownToggle
              outline
              className="dropdown-toggle-split"
              color="primary"
              caret
            ></DropdownToggle>
            <DropdownMenu end>
              {pageData?.contactType &&
                pageData?.contactType.map((value, index) => (
                  <DropdownItem
                    key={index}
                    onClick={(e) =>
                      sectionLevelEdit(e, {
                        dlevel: "contact_type_id",
                        dlevel_name: "contact_type_name",
                        f_val: e.target.value,
                        t_val: value.name
                      })
                    }
                    value={value.id}
                  >
                    <Input type='checkbox' id='basic-cb-unchecked2' defaultChecked={formData.contact_type_name == value.name && true} /> {value.name}
                  </DropdownItem>
                ))}

              <DropdownItem divider></DropdownItem>
              {/* <DropdownItem
                href="/"
                tag="a"
                onClick={(e) => e.preventDefault()}
              >
                <Plus size={15} />
                Add new Contact Type
              </DropdownItem> */}
            </DropdownMenu>
          </UncontrolledButtonDropdown>
        </div>
        
                  <div className="mb-2">
                    <Label className="form-label" for="email">
                      Contact Name*:
                    </Label>
                    <Input
                      type="text"
                      id="email"
                      placeholder=""
                      onChange={(e) =>
                        handleCategoryChange(e, {
                          dlevel: "contact_name",
                          f_val: e.target.value
                        })
                      }
                    />
                  </div>

                  <div className="mb-2">
                    <Label className="form-label" for="email">
                      Primary Contact No*:
                    </Label>
                    <Input
                      type="number"
                      id="email"
                      placeholder=""
                      onChange={(e) =>
                        handleCategoryChange(e, {
                          dlevel: "primary_number",
                          f_val: e.target.value
                        })
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <Label className="form-label" for="email">
                      Secondary Contact No:
                    </Label>
                    <Input
                      type="number"
                      id="email"
                      placeholder=""
                      onChange={(e) =>
                        handleCategoryChange(e, {
                          dlevel: "secondary_number",
                          f_val: e.target.value
                        })
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <Label className="form-label" for="email">
                      Remarks:
                    </Label>
                    <Input
                      type="textarea"
                      id="email"
                      placeholder=""
                      onChange={(e) =>
                        handleCategoryChange(e, {
                          dlevel: "remarks",
                          f_val: e.target.value
                        })
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <Label className="form-label" for="email">
                      Doccument Upload:
                    </Label>
                    {/* <FileUploaderMultiple {...{setCustomModal}}/> */}
                    <Input type="file" multiple onChange={handleFileSelect} />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    onClick={(e) => handleContactCreate()}
                  >
                    Save
                  </Button>
                </ModalFooter>
              </Modal>
          {/* <UncontrolledButtonDropdown className="w-50">
            <Button outline color="primary">
              {formData.book_contact_name}
            </Button>
            <DropdownToggle
              outline
              className="dropdown-toggle-split"
              color="primary"
              caret
            ></DropdownToggle>
            <DropdownMenu end>
              {pageData?.bookContact &&
                pageData?.bookContact.map((value, index) => (
                  <DropdownItem
                    key={index}
                    onClick={(e) =>
                      sectionLevelEdit(e, {
                        dlevel: "book_contact_id",
                        dlevel_name: "book_contact_name",
                        f_val: e.target.value,
                        t_val: value.name
                      })
                    }
                    value={value.id}
                  >
                   <Input type='checkbox' id='basic-cb-unchecked3' defaultChecked={formData.book_contact_name == value.name && true} /> {value.name}
                    
                  </DropdownItem>
                ))}

              <DropdownItem divider></DropdownItem>
              
              
            </DropdownMenu>
          </UncontrolledButtonDropdown> */}
        </div>

        <Row>
          <Row>
            <Col md="6" sm="12">
              <div className="mb-1">
                <Label className="form-label" for="salary">
                  Amount
                </Label>
                <InputGroup>
                  <Input
                    type="number"
                    id="salary"
                    onChange={(e) =>
                      sectionLevelEdit(e, {
                        dlevel: "amount",
                        f_val: e.target.value
                      })
                    }
                    value={formData.amount}
                  />
                </InputGroup>
              </div>
            </Col>

            <Col md="6" sm="12">
              <div className="mb-1">
                <Label className="form-label" for="salary">
                  Page No
                </Label>
                <InputGroup>
                  <Input
                    type="number"
                    id="salary"
                    onChange={(e) =>
                      sectionLevelEdit(e, {
                        dlevel: "page_no",
                        f_val: e.target.value
                      })
                    }
                    value={formData.page_no}
                  />
                </InputGroup>
              </div>
            </Col>
          </Row>
          <Col md="6" sm="12">
            <div className="mb-1">
              <Label className="form-label d-block" for="post">
                Category
              </Label>
              <UncontrolledButtonDropdown className="w-100">
                <Button outline color="primary">
                  {formData.transaction_category_name}
                </Button>
                <DropdownToggle
                  outline
                  className="dropdown-toggle-split"
                  color="primary"
                  caret
                ></DropdownToggle>
                <DropdownMenu end>
                  {pageData?.transactionCategory &&
                    pageData?.transactionCategory.map((value, index) => (
                      <DropdownItem
                        key={index}
                        onClick={(e) =>
                          sectionLevelEdit(e, {
                            dlevel: "transaction_category_id",
                            dlevel_name: "transaction_category_name",
                            f_val: e.target.value,
                            t_val: value.name
                          })
                        }
                        value={value.id}
                      >
                      <Input type='checkbox' id='basic-cb-unchecked1' defaultChecked={formData.transaction_category_name == value.name && true} />  {value.name}
                      </DropdownItem>
                    ))}
                  <div>
                    <DropdownItem
                      href="/"
                      tag="a"
                      onClick={(e) => {
                        e.preventDefault()
                        setFormModal(!formModal)
                      }}
                    >
                      <Plus size={15} />
                      Add new Category
                    </DropdownItem>
                    <Modal
                      isOpen={formModal}
                      toggle={() => setFormModal(!formModal)}
                      className="modal-dialog-centered"
                    >
                      <ModalHeader toggle={() => setFormModal(!formModal)}>
                        Add New Category
                      </ModalHeader>
                      <ModalBody>
                        <div className="mb-2">
                          <Label className="form-label" for="email">
                            Category Name:
                          </Label>
                          <Input
                            type="email"
                            id="email"
                            placeholder="e.g. Salary, Food, Travel"
                            onChange={(e) =>
                              handleCategoryChange(e, {
                                dlevel: "category_name",
                                f_val: e.target.value
                              })
                            }
                          />
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="primary"
                          onClick={(e) => handleCategoryCreate()}
                        >
                          Save
                        </Button>
                      </ModalFooter>
                    </Modal>
                  </div>
                </DropdownMenu>
              </UncontrolledButtonDropdown>
            </div>
          </Col>
          <Col md="6" sm="12">
            <div className="mb-1">
              <Label className="form-label d-block" for="post">
                Payment Method
              </Label>
              {/* <Select
              theme={selectThemeColors}
              className="react-select"
              classNamePrefix="select"
              options={pageData?.paymentMethod}
              isClearable={false}
              onChange={(e) =>
                sectionLevelEdit(e, {
                  dlevel: "payment_method_id",
                  dlevel_name: "payment_method_name",
                  f_val: e.target.value,
                  t_val: value.name,
                })
              }
            /> */}
              <UncontrolledButtonDropdown className="w-100">
                <Button outline color="primary">
                  {formData.payment_method_name}
                </Button>
                <DropdownToggle
                  outline
                  className="dropdown-toggle-split"
                  color="primary"
                  caret
                ></DropdownToggle>
                <DropdownMenu end>
                  {pageData?.paymentMethod &&
                    pageData?.paymentMethod.map((value, index) => (
                      <DropdownItem
                        key={index}
                        onClick={(e) =>
                          sectionLevelEdit(e, {
                            dlevel: "payment_method_id",
                            dlevel_name: "payment_method_name",
                            f_val: e.target.value,
                            t_val: value.name
                          })
                        }
                        value={value.id}
                      >
                       <Input type='checkbox' id='basic-cb-unchecked' defaultChecked={formData.payment_method_name == value.name && true} /> {value.name}
                      </DropdownItem>
                    ))}
                 
                </DropdownMenu>
              </UncontrolledButtonDropdown>
            </div>
          </Col>
        </Row>

        <Row>
          <Col md="12" sm="12">
            <div className="mb-1">
              <Label className="form-label d-block" for="post">
                Description 
              </Label>
              <Input
                type="textarea"
                id="email"
                placeholder="description..."
                onChange={(e) =>
                  sectionLevelEdit(e, {
                    dlevel: "description",
                    f_val: e.target.value
                  })
                }
                value={formData.description}
              />
            </div>
          </Col>
        </Row>

        <Button
          className="me-1"
          color="primary"
          onClick={(e) => handleFormSubmit(e)}
        >
          Submit
        </Button>
        <Button color="secondary" onClick={handleModal} outline>
          Cancel
        </Button>
      </ModalBody>
    </Modal>
  )
}

export default TransactionDetailsAddModal
