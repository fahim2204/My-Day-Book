// ** Icons Imports
import {
  Copy,
  MoreVertical,
  Edit2,
  Trash2,
  UserX,
  ArrowLeft,
  Link as LinkIcon
} from "react-feather"
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import {
  GetContactList,
  CreateNewContact,
  disableContactById,
  enableContactById,
  deleteContact,
  UpdateContact
} from "@apifile"
// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Badge,
  CardBody,
  CardText,
  CardTitle,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Input,
  Button,
  UncontrolledButtonDropdown
} from "reactstrap"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const MySwal = withReactContent(Swal)

const ContactListTable = () => {
  const [pageData, setPageData] = useState([])
  const [searchValue, setSearchValue] = useState("")
  const { param_id } = useParams()
  const [formContactModal, setFormContactModal] = useState(false)
  const [formContactEditModal, setFormContactEditModal] = useState(false)
  const [customModal, setCustomModal] = useState({
    category_name: "",
    business_id: "",
    contact_name: "",
    id: "",
    book_id: "",
    primary_number: "",
    secondary_number: "",
    remarks: "",
    supllier_files: [],
    contact_type_id: "",
    contact_type_name: "Select"
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  const fetchData = async () => {
    GetContactList(param_id)
      .then((res) => {
        if (res.status === 200) {
          setPageData(res.data)
        }
      })
      .catch((err) => err)
  }

  const handleFileSelect = (event) => {
    // setSelectedFiles([...selectedFiles, ...event.target.files]);
    setSelectedFiles(event.target.files)
  };

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
          confirmButton: "btn btn-primary",
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
            supllier_files: [],
            contact_type_id: "",
            contact_type_name: "Select",
          });
          setFormContactModal(!formContactModal);
        }
      })
      .catch((err) => err)
  }

  const handleContactUpdate = () => {
    if (
      (customModal.contact_name === "" || customModal.contact_type_id === "" || customModal.primary_number === "") &&
      formContactEditModal === true
    ) {

      if(customModal.contact_type_id === ""){
        MySwal.fire({
          title: "Warning!",
          text: " Please select contact type again",
          icon: "warning",
          customClass: {
            confirmButton: "btn btn-primary"
          },
          buttonsStyling: false
        })
        return false
      }else{
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
      
    }
    const formData = new FormData()
    for (let file of selectedFiles) {
      formData.append("files[]", file)
    }
    formData.append("contact_type_id", customModal.contact_type_id)
    formData.append("contact_name", customModal.contact_name)
    formData.append("primary_number", customModal.primary_number)
    formData.append("secondary_number", customModal.secondary_number)
    formData.append("remarks", customModal.remarks)
    formData.append("id", customModal.id)
    // return false;
    UpdateContact(formData)
      .then((res) => {
        if (res.status === 200) {
          MySwal.fire({
            title: "success!",
            text: "Your contact updated successfully!",
            icon: "success",
            customClass: {
              confirmButton: "btn btn-primary"
            },
            buttonsStyling: false,
            timerProgressBar: true,
            timer: 2000
          });

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
          setFormContactEditModal(!formContactEditModal)
        }
      })
      .catch((err) => err)
  }

  const handleCategoryChange = (e, fieldName) => {
    setCustomModal((oldList) => {
      const newList = JSON.parse(JSON.stringify(oldList))
      const getField = fieldName.dlevel
      newList[getField] = fieldName.f_val
      newList.business_id = pageData?.business_id
      newList.book_id = pageData?.book_id
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

  const handleContactDisable = (data) => {
    if (data.status === 1) {
      disableContactById({ id: data.id })
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
              supllier_files: [],
              contact_type_id: "",
              contact_type_name: "Select"
            })

            fetchData()
          }
        })
        .catch((err) => err)
    } else {
      enableContactById({ id: data.id })
        .then((res) => {
          if (res.status === 200) {
            MySwal.fire({
              title: "success!",
              text: "Your contact enabled successfully!",
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
              supllier_files: [],
              contact_type_id: "",
              contact_type_name: "Select"
            })

            fetchData()
          }
        })
        .catch((err) => err)
    }
  }

  const handleDeleteRow = (e, data) => {
    e.preventDefault()
    deleteContact({ id: data })
      .then((res) => {
        if (res.status === 200) {
          MySwal.fire({
            title: "success!",
            text: res.message,
            icon: "success",
            customClass: {
              confirmButton: "btn btn-primary"
            },
            buttonsStyling: false,
            timerProgressBar: true,
            timer: 2000
          });
          fetchData()
        } else {
          MySwal.fire({
            title: "warning!",
            text: res.message,
            icon: "warning",
            customClass: {
              confirmButton: "btn btn-primary"
            },
            buttonsStyling: false
          })
        }
      })
      .catch((err) => err)
  }

  const handleEditRow = (e, data) => {
    setCustomModal((oldList) => {
      const newList = JSON.parse(JSON.stringify(oldList))
      newList.contact_type_name = data?.contactTypeName
      newList.book_id = data?.book_id
      newList.business_id = data?.business_id
      newList.contact_name = data?.name
      newList.primary_number = data?.primary_number
      newList.secondary_number = data?.secondary_number
      newList.remarks = data?.remarks
      newList.id = data?.id
      return newList
    })

    setFormContactEditModal(!formContactEditModal)
  }

  // ** Function to handle filter
  const handleSearch = (e) => {
    const value = e.target.value
    setSearchValue(value)
    if (value.length) {
      const updatedData = pageData?.contacts?.filter((item) => {
        const startsWith =
          item?.name?.toLowerCase().startsWith(value.toLowerCase()) 
        const includes =
          item?.name?.toLowerCase().includes(value.toLowerCase()) 

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })

      setSearchValue(value)

      setPageData((oldList) => {
        const newList = JSON.parse(JSON.stringify(oldList))
        newList.contacts = [...updatedData]
        return newList
      })

    } else {

      fetchData()
    }
  }

  useEffect(() => {
    fetchData()
  }, [])
  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">
            <Link to={"../"}>
              <ArrowLeft />
            </Link>
            Contact List
        </CardTitle>
        <Col className="d-flex align-items-center" md="3" sm="12">
              <Label className="me-1" for="search-input">
                Search
              </Label>
              <Input
                className="dataTable-filter mb-50"
                type="text"
                bsSize="sm"
                id="search-input"
                value={searchValue}
                onChange={handleSearch}
                style={{ height: "38px", margin: "10px 0 0" }}
              />
        </Col>
        
        <Button
            className="btn btn-primary"
            onClick={(e) => {
              e.preventDefault()
              setFormContactModal(!formContactModal)
            }}
          >
            Add Contact
        </Button>
      </CardHeader>
      <CardBody>
        <Row className="gy-2">
          {pageData?.contacts?.length ? pageData?.contacts?.map((item) => (
            <Col sm={12} key={item.key}>
              <div className="bg-light-secondary position-relative rounded p-2">
                <UncontrolledDropdown className="btn-pinned">
                  <DropdownToggle tag="span" className="cursor-pointer">
                    <MoreVertical size={18} />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem
                      className="d-flex align-items-center w-100"
                      onClick={() => handleContactDisable(item)}
                    >
                      <UserX size={14} className="me-50" />
                      <span>{item.status === 1 ? "Deactive" : "Active"}</span>
                    </DropdownItem>
                    <DropdownItem
                      className="d-flex align-items-center w-100"
                      onClick={(e) => handleEditRow(e, item)}
                    >
                      <Edit2 size={14} className="me-50" />
                      <span>Edit</span>
                    </DropdownItem>
                    <DropdownItem
                      className="d-flex align-items-center w-100"
                      onClick={(e) => handleDeleteRow(e, item.id)}
                    >
                      <Trash2 size={14} className="me-50" />
                      <span>Delete</span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <div className="d-flex align-items-center flex-wrap">
                  <h4 className="mb-1 me-1">{item.name}</h4>
                  <Badge className="mb-1" color="light-primary">
                    {item.contactTypeName}
                  </Badge>
                </div>
                <span>
                  {item.primary_number} || {item.secondary_number}{" "}
                </span>{" "}
                || Status:{" "}
                <Badge
                  className="mb-1"
                  color={item.status === 1 ? "light-success" : "light-danger"}
                >
                  {item.status === 1 ? "Active" : "Deactive"}
                </Badge>{" "}
                || Doccuments:{" "}
                {item?.images &&
                  JSON.parse(item?.images).map((item, index) => (
                    <Link
                      to={`${
                        import.meta.env.VITE_APP_BASE_URL
                      }/uploads/images/${item}`}
                      target="_blank"
                      key={index}
                    >
                      <LinkIcon size={15} />
                      {`file- ${index + 1}`},
                    </Link>
                  ))}
              </div>
            </Col> 
          )) : <h6 className="text-center">No Data Found</h6>}
        </Row>
      </CardBody>
      <Modal
        isOpen={formContactModal}
        toggle={() => setFormContactModal(!formContactModal)}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={() => setFormContactModal(!formContactModal)}>
          Add New Contact
        </ModalHeader>
        <ModalBody>
          <div className="mb-1">
            <Label className="form-label d-block" for="full-name">
              Contact Type
            </Label>
            <UncontrolledButtonDropdown className="w-50">
              <Button outline color="primary">
                {customModal.contact_type_name}
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
                        handleCategoryChange(e, {
                          dlevel: "contact_type_id",
                          dlevel_name: "contact_type_name",
                          f_val: e.target.value,
                          t_val: value.name
                        })
                      }
                      value={value.id}
                    >
                      {value.name}
                    </DropdownItem>
                  ))}
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
                  f_val: e.target.value,
                })
              }
              defaultValue={customModal.contact_name}
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
              defaultValue={customModal.primary_number}
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
              defaultValue={customModal.secondary_number}
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
              defaultValue={customModal.remarks}
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
          <Button color="primary" onClick={handleContactCreate}>
            Save
          </Button>
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={formContactEditModal}
        toggle={() => setFormContactEditModal(!formContactEditModal)}
        className="modal-dialog-centered"
      >
        <ModalHeader
          toggle={() => setFormContactEditModal(!formContactEditModal)}
        >
          Edit Contact
        </ModalHeader>
        <ModalBody>
          <div className="mb-1">
            <Label className="form-label d-block" for="full-name">
              Contact Type
            </Label>
            <UncontrolledButtonDropdown className="w-50">
              <Button outline color="primary">
                {customModal.contact_type_name}
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
                        handleCategoryChange(e, {
                          dlevel: "contact_type_id",
                          dlevel_name: "contact_type_name",
                          f_val: e.target.value,
                          t_val: value.name
                        })
                      }
                      value={value.id}
                    >
                      {value.name}
                    </DropdownItem>
                  ))}
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
              defaultValue={customModal.contact_name}
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
              defaultValue={customModal.primary_number}
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
              defaultValue={customModal.secondary_number}
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
              defaultValue={customModal.remarks}
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
          <Button color="primary" onClick={(e) => handleContactUpdate()}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    </Card>
  )
}

export default ContactListTable
