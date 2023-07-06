// ** React Imports
import { useState, useEffect } from "react";

// ** Third Party Components
import Flatpickr from "react-flatpickr";
import { Calendar, X } from "react-feather";
import Select from "react-select";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
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
  DropdownItem,
} from "reactstrap";

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { updateNote } from "@apifile";

const EditNoteModal = ({ open, handleModal, fetchData, editNote }) => {
  // ** State
  const [formData, setFormData] = useState({
    date: new Date(),
    title: "",
    id: "",
    description: "",
  });

  // ** Custom close btn
  const CloseBtn = (
    <X className="cursor-pointer" size={15} onClick={() => handleModal("")} />
  );

  // ** Formate Date
  function formateDate(date = new Date()) {
    const offset = new Date(date).getTimezoneOffset();
    date = new Date(new Date(date).getTime() - offset * 60 * 1000);

    const formattedDate = new Date(date).toISOString().split("T")[0];

    return formattedDate;
  }

  const handleDate = (date) => {
    setFormData((oldList) => {
      const newList = { ...oldList };
      newList.date = formateDate(date);
      console.log(newList.date);
      return newList;
    });
  };

  const sectionLevelEdit = (e, fieldName) => {
    setFormData((oldList) => {
      const newList = { ...oldList };
      const getField = fieldName.dlevel;
      newList[getField] = fieldName.f_val;
      return newList;
    });
  };

  const handleFormSubmit = () => {
    if (
      formData.amount === 0 ||
      formData.title === "" ||
      formData.description === ""
    ) {
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

    console.log(formData);

    updateNote(formData)
      .then((res) => {
        if (res.status === 200) {
          MySwal.fire({
            title: "success!",
            text: "Your Transaction saved successfully!",
            icon: "success",
            customClass: {
              confirmButton: "btn btn-primary",
            },
            buttonsStyling: false,
            timerProgressBar: true,
            timer: 2000,
          });

          handleModal("");
          setFormData({
            date: new Date(),
            name: "",
            id: "",
            description: "",
          });

          fetchData();
        }
      })
      .catch((err) => err);
  };

  useEffect(() => {
    setFormData({
      date: editNote.date,
      id: editNote.id,
      title: editNote.title,
      description: editNote.description,
    });
  }, [editNote]);

  return (
    <Modal
      isOpen={open}
      toggle={() => handleModal()}
      className="sidebar-lg"
      modalClassName="modal-slide-in"
      contentClassName="pt-0"
    >
      <ModalHeader
        className="mb-1"
        toggle={() => handleModal()}
        close={CloseBtn}
        tag="div"
      >
        <h5 className="modal-title">Edit Note</h5>
      </ModalHeader>
      <ModalBody className="flex-grow-1">
        <Row>
          <Col sm="12">
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
                  value={formData.date}
                  onChange={(date) => handleDate(date)}
                />
              </InputGroup>
            </div>
          </Col>
        </Row>

        <div className="mb-2">
          <Label className="form-label" for="title">
            Title:
          </Label>
          <Input
            type="text"
            id="title"
            value={formData.title}
            placeholder="Title"
            onChange={(e) =>
              sectionLevelEdit(e, {
                dlevel: "title",
                f_val: e.target.value,
              })
            }
          />
        </div>

        <div className="mb-2">
          <Label className="form-label" for="desc">
            Description:
          </Label>
          <Input
            type="textarea"
            id="desc"
            value={formData.description}
            placeholder="Description"
            onChange={(e) =>
              sectionLevelEdit(e, {
                dlevel: "description",
                f_val: e.target.value,
              })
            }
          />
        </div>

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
  );
};

export default EditNoteModal;
