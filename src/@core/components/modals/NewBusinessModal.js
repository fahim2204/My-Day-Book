import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// ** Reactstrap Imports
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
} from "reactstrap";
import { AddnewBook, EditnewBook } from "@apifile";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
const NewBusinessModal = ({
  formModal,
  setFormModal,
  fetchData,
  modalData,
}) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    businessId: id,
    book_name: "",
    id: "",
  });

  const handleFormSubmit = (e) => {
    if (formData.businessId == "" || formData.book_name == "") {
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
    if (modalData.type == "edit") {
      EditnewBook(formData)
        .then((res) => {
          if (res.status === 200) {
            MySwal.fire({
              title: "success!",
              text: "Your book update successfully!",
              icon: "success",
              customClass: {
                confirmButton: "btn btn-primary",
              },
              buttonsStyling: false,
            });

            setFormData({
              businessId: id,
              book_name: "",
            });
            fetchData();
            setFormModal(false);
          }
        })
        .catch((err) => {
          MySwal.fire({
            title: "warning!",
            text: "Your book update failed!",
            icon: "warning",
            customClass: {
              confirmButton: "btn btn-primary",
            },
            buttonsStyling: false,
          });
        });
    } else {
      AddnewBook(formData)
        .then((res) => {
          if (res.status === 200) {
            MySwal.fire({
              title: "success!",
              text: "Your Book saved successfully!",
              icon: "success",
              customClass: {
                confirmButton: "btn btn-primary",
              },
              buttonsStyling: false,
            });

            setFormData({
              businessId: id,
              book_name: "",
            });
            fetchData();
            setFormModal(false);
          }
        })
        .catch((err) => err);
    }
  };

  const sectionLevelEdit = (e, fieldName) => {
    setFormData((oldList) => {
      let newList = JSON.parse(JSON.stringify(oldList));
      let getField = fieldName.dlevel;
      newList[getField] = fieldName.f_val;
      newList.businessId = id;
      console.log("...", newList);
      return newList;
    });
  };

  const updateFormDate = (data) => {
    setFormData((oldList) => {
      let newList = JSON.parse(JSON.stringify(oldList));
      newList.book_name = modalData.name;
      if (modalData.type == "edit") {
        newList.id = modalData.business_id;
      } else {
        newList.businessId = modalData.business_id;
      }
      return newList;
    });
  };

  useEffect(() => {
    updateFormDate(modalData);
    console.log("testsd", modalData, formData);
  }, [modalData]);

  return (
    <div>
      <Modal
        isOpen={formModal}
        toggle={() => setFormModal(!formModal)}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={() => setFormModal(!formModal)}>
          Add New Cashbook
        </ModalHeader>
        <ModalBody>
          <div className="mb-2">
            <Label className="form-label" for="email">
              Book Name:
            </Label>
            <Input
              type="text"
              id="email"
              onChange={(e) =>
                sectionLevelEdit(e, {
                  dlevel: "book_name",
                  f_val: e.target.value,
                })
              }
              value={formData.book_name}
              placeholder="Name Of Cashbook"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={(e) => handleFormSubmit(e)}>
            Save
          </Button>{" "}
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default NewBusinessModal;
