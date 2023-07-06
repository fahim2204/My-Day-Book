// ** Icons Imports
import {
  Copy,
  MoreVertical,
  Edit2,
  Trash2,
  UserX,
  ArrowLeft,
} from "react-feather";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  GetTransactionCategory,
  CreateNewCategory,
  disableContactById,
  enableContactById,
  deleteTransactionCategory,
  UpdateTransactionCategory,
} from "@apifile";
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
  UncontrolledButtonDropdown,
} from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Link as LinkIcon } from "react-feather";
const MySwal = withReactContent(Swal);

const CategoryListTable = () => {
  const [pageData, setPageData] = useState([]);
  const { param_id } = useParams();
  const [formContactModal, setFormContactModal] = useState(false);
  const [formContactEditModal, setFormContactEditModal] = useState(false);
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
    contact_type_name: "Select",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileSelect = (event) => {
    // setSelectedFiles([...selectedFiles, ...event.target.files]);
    setSelectedFiles(event.target.files);
  };

  const fetchData = async () => {
    GetTransactionCategory(param_id)
      .then((res) => {
        if (res.status === 200) {
          setPageData(res.data);
        }
      })
      .catch((err) => err);
  };

  const handleContactCreate = () => {
    if (customModal.category_name === "" && formContactModal === true) {
      MySwal.fire({
        title: "Warning!",
        text: " Please select required fields!",
        icon: "warning",
        customClass: {
          confirmButton: "btn btn-primary",
        },
        buttonsStyling: false,
      });
      return false;
    }
    const formData = new FormData();
    formData.append("category_name", customModal.category_name);
    formData.append("business_id", customModal.business_id);
    // return false;
    CreateNewCategory(formData)
      .then((res) => {
        if (res.status === 200) {
          MySwal.fire({
            title: "success!",
            text: "Your category saved successfully!",
            icon: "success",
            customClass: {
              confirmButton: "btn btn-primary",
            },
            buttonsStyling: false,
            timerProgressBar: true,
            timer: 2000,
          });

          fetchData();
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
      .catch((err) => err);
  };

  const handleContactUpdate = () => {
    if (customModal.category_name === "" && formContactEditModal === true) {
      MySwal.fire({
        title: "Warning!",
        text: " Please select required fields!",
        icon: "warning",
        customClass: {
          confirmButton: "btn btn-primary",
        },
        buttonsStyling: false,
      });
      return false;
    }
    const formData = new FormData();

    formData.append("category_name", customModal.category_name);
    formData.append("id", customModal.id);
    // return false;
    UpdateTransactionCategory(formData)
      .then((res) => {
        if (res.status === 200) {
          MySwal.fire({
            title: "success!",
            text: "Your category updated successfully!",
            icon: "success",
            customClass: {
              confirmButton: "btn btn-primary",
            },
            buttonsStyling: false,
            timerProgressBar: true,
            timer: 2000,
          });

          fetchData();
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
          setFormContactEditModal(!formContactEditModal);
        }
      })
      .catch((err) => err);
  };

  const handleCategoryChange = (e, fieldName) => {
    setCustomModal((oldList) => {
      const newList = JSON.parse(JSON.stringify(oldList));
      const getField = fieldName.dlevel;
      newList[getField] = fieldName.f_val;
      newList.business_id = pageData?.business_id;
      newList.book_id = pageData?.book_id;
      if (
        getField === "contact_type_id" ||
        getField === "book_contact_id" ||
        getField === "transaction_category_id" ||
        getField === "payment_method_id"
      ) {
        const getField_name = fieldName.dlevel_name;
        newList[getField_name] = fieldName.t_val;
      }
      return newList;
    });
  };

  const handleContactDisable = (data) => {
    if (data.status == 1) {
      disableContactById({ id: data.id })
        .then((res) => {
          if (res.status === 200) {
            MySwal.fire({
              title: "success!",
              text: "Your contact disabled successfully!",
              icon: "success",
              customClass: {
                confirmButton: "btn btn-primary",
              },
              buttonsStyling: false,
              timerProgressBar: true,
              timer: 2000,
            });

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

            fetchData();
          }
        })
        .catch((err) => err);
    } else {
      enableContactById({ id: data.id })
        .then((res) => {
          if (res.status === 200) {
            MySwal.fire({
              title: "success!",
              text: "Your contact enabled successfully!",
              icon: "success",
              customClass: {
                confirmButton: "btn btn-primary",
              },
              buttonsStyling: false,
              timerProgressBar: true,
              timer: 2000,
            });

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

            fetchData();
          }
        })
        .catch((err) => err);
    }
  };

  const handleDeleteRow = (e, data) => {
    e.preventDefault();
    deleteTransactionCategory({ id: data })
      .then((res) => {
        if (res.status === 200) {
          MySwal.fire({
            title: "success!",
            text: res.message,
            icon: "success",
            customClass: {
              confirmButton: "btn btn-primary",
            },
            buttonsStyling: false,
            timerProgressBar: true,
            timer: 2000,
          });
          fetchData();
        } else {
          MySwal.fire({
            title: "warning!",
            text: res.message,
            icon: "warning",
            customClass: {
              confirmButton: "btn btn-primary",
            },
            buttonsStyling: false,
          });
        }
      })
      .catch((err) => err);
  };

  const handleEditRow = (e, data) => {
    setCustomModal((oldList) => {
      const newList = JSON.parse(JSON.stringify(oldList));
      newList.book_id = data?.book_id;
      newList.business_id = data?.business_id;
      newList.category_name = data?.name;
      newList.id = data?.id;
      return newList;
    });

    setFormContactEditModal(!formContactEditModal);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">
          <Link to={"../"}>
            <ArrowLeft />
          </Link>{" "}
          Category List
        </CardTitle>
        <Button
          className="btn btn-primary"
          onClick={(e) => {
            e.preventDefault();
            setFormContactModal(!formContactModal);
          }}
        >
          Add Category
        </Button>
      </CardHeader>
      <CardBody>
        <Row className="gy-2">
          {pageData?.category?.map((item) => (
            <Col sm={12} key={item.key}>
              <div className="bg-light-secondary position-relative rounded p-2">
                <UncontrolledDropdown className="btn-pinned">
                  <DropdownToggle tag="span" className="cursor-pointer">
                    <MoreVertical size={18} />
                  </DropdownToggle>
                  <DropdownMenu>
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
                Status:{" "}
                <Badge
                  className="mb-1"
                  color={item.status == 0 ? "light-danger" : "light-success"}
                >
                  {item.status == 0 ? "Deactive" : "Active"}
                </Badge>
              </div>
            </Col>
          ))}
        </Row>
      </CardBody>
      <Modal
        isOpen={formContactModal}
        toggle={() => setFormContactModal(!formContactModal)}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={() => setFormContactModal(!formContactModal)}>
          Add Category
        </ModalHeader>
        <ModalBody>
          <div className="mb-2">
            <Label className="form-label" for="email">
              Category Name*:
            </Label>
            <Input
              type="text"
              id="email"
              placeholder=""
              onChange={(e) =>
                handleCategoryChange(e, {
                  dlevel: "category_name",
                  f_val: e.target.value,
                })
              }
              defaultValue={customModal.category_name}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={(e) => handleContactCreate()}>
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
          Edit Category
        </ModalHeader>
        <ModalBody>
          <div className="mb-2">
            <Label className="form-label" for="email">
              Category Name*:
            </Label>
            <Input
              type="text"
              id="email"
              placeholder=""
              onChange={(e) =>
                handleCategoryChange(e, {
                  dlevel: "category_name",
                  f_val: e.target.value,
                })
              }
              defaultValue={customModal.category_name}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={(e) => handleContactUpdate()}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    </Card>
  );
};

export default CategoryListTable;
