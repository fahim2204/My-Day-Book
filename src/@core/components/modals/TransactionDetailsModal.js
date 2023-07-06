// ** React Imports
import { useState, useEffect } from "react"

// ** Third Party Components
import Flatpickr from "react-flatpickr"
import { Calendar, X, Clock, Plus,  } from "react-feather"
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
  DropdownItem,Card, CardBody, CardHeader, CardTitle
} from "reactstrap"

// ** Component
import Timeline from "../timeline/Timeline"

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss"
import {
  storeBookTransactionData,
  updateBookTransaction,
  CreateNewCategory,
  CreateNewContact,
  disableContactById
} from "@apifile"
const TransactionDetailsModal = ({
  open,
  handleModal,
  pageData,
  transType,
  fetchData,
  editData
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
    payment_method_id: "",
    payment_method_name: "Select",
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

  const handleFileSelect = (event) => {
    // setSelectedFiles([...selectedFiles, ...event.target.files]);
    setSelectedFiles(event.target.files)
  }

  // ** Custom close btn
  const CloseBtn = (
    <X className="cursor-pointer" size={15} onClick={() => handleModal("")} />
  )

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
        getField === "book_contact_id" ||
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
      formData.amount === 0 ||
      formData.transaction_category_id === "" ||
      formData.payment_method_id === "" ||
      formData.book_id === "" ||
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
      })
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
              payment_method_id: "",
              payment_method_name: "Select",
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
              payment_method_id: "",
              payment_method_name: "Select",
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
      })
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
          })
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
        <h5 className="modal-title">Entry Details</h5>
      </ModalHeader>
      <ModalBody className="flex-grow-1">
        
      <Card>
        <CardHeader>
        {editData?.type == "cashIn" ? <>
        <CardTitle tag='h4'><div><Plus size={20} style={{ marginRight:"10px",color:"green"}} /><small style={{ color:"green"}}>Cash In</small></div><div style={{fontSize:"30px",color:"green"}} >{editData?.amount}</div>

          <div>{editData?.date}</div>
          <hr/>
          <div>{editData?.methodName}</div>
          
          </CardTitle>
        </> : <>
        <CardTitle tag='h4'><div><Plus size={20} style={{ marginRight:"10px",color:"red"}} /><small style={{ color:"red"}}>Cash Out</small></div><div style={{fontSize:"30px",color:"red"}} >{editData?.amount}</div>

          <div>{editData?.date}</div>
          <hr/>
          <div>{editData?.methodName}</div>
          
          </CardTitle>
        </>}
          
        </CardHeader>
        <CardBody>
         <div>Category : {editData?.transactionCategoryName}  </div> 
         <div>Page No : {editData?.page_no}  </div> 
         <div>Details : {editData?.description}  </div> 
         <br/><br/>
         <h4>Activities</h4>
         <div>Created By : You  </div> 
         <div>Created date : {editData?.date}  </div> 
         <div>Created time : {editData?.time}  </div> 

        </CardBody>
      </Card>
       
        <Button color="secondary" onClick={handleModal} outline>
          Cancel
        </Button>
      </ModalBody>
    </Modal>
  )
}

export default TransactionDetailsModal
