// ** Icons Imports
import { Copy, MoreVertical, Edit2, Trash2, ArrowLeft } from "react-feather";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getPaymentModeList,
  makePaymentMode,
  updatePaymentMethod,
  deletePaymentMehod,
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
const MySwal = withReactContent(Swal);

const PaymentListTable = () => {
  const [pageData, setPageData] = useState([]);
  const { param_id } = useParams();
  const [formContactModal, setFormContactModal] = useState(false);
  const [customModal, setCustomModal] = useState({
    name: "",
  });

  const fetchData = async () => {
    getPaymentModeList(param_id)
      .then((res) => {
        if (res.status === 200) {
          setPageData(res.data);
        }
      })
      .catch((err) => err);
  };

  const handleMethodAdd = () => {
    if (customModal.name === "") {
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

    formData.append("name", customModal.name);

    if (customModal.edit) {
      formData.append("id", customModal.id);

      updatePaymentMethod(formData)
        .then((res) => {
          if (res.status === 200) {
            MySwal.fire({
              title: "success!",
              text: "Your method update successfully!",
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
    } else {
      // return false;
      makePaymentMode(formData)
        .then((res) => {
          if (res.status === 200) {
            MySwal.fire({
              title: "success!",
              text: "Your method saved successfully!",
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
    }
  };

  const handleNameChange = (e, fieldName) => {
    setCustomModal((oldList) => {
      const newList = JSON.parse(JSON.stringify(oldList));
      const getField = fieldName.dlevel;
      newList[getField] = fieldName.f_val;
      return newList;
    });
  };

  const handleDeleteRow = (e, data) => {
    e.preventDefault();
    deletePaymentMehod({ id: data })
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
    setFormContactModal(!formContactModal);
    setCustomModal((oldList) => {
      const newList = JSON.parse(JSON.stringify(oldList));
      newList.id = data?.id;
      newList.name = data?.name;
      newList.edit = true;
      return newList;
    });
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
          Payment Mode
        </CardTitle>
        <Button
          className="btn btn-primary"
          onClick={(e) => {
            e.preventDefault();
            setFormContactModal(!formContactModal);
          }}
        >
          Add Payment Method
        </Button>
      </CardHeader>
      <CardBody>
        <Row className="gy-2">
          {pageData?.map((item) => (
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
                </div>
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
          Add New Contact
        </ModalHeader>
        <ModalBody>
          <div className="mb-2">
            <Label className="form-label" for="name">
              Payment Name*:
            </Label>
            <Input
              type="text"
              id="name"
              placeholder="Enter Method Mode"
              value={customModal.name}
              onChange={(e) =>
                handleNameChange(e, {
                  dlevel: "name",
                  f_val: e.target.value,
                })
              }
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleMethodAdd}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    </Card>
  );
};

export default PaymentListTable;
