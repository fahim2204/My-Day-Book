import React, { useState, useEffect } from "react"
// ** Reactstrap Imports
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input
} from "reactstrap"
import { resetPassword } from "@apifile"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const MySwal = withReactContent(Swal)
const PasswordResetModal = ({open, setOpen}) => {

  const [formData, setFormData] = useState({
    old_password:"",
    password:"",
    password_confirmation: ""
  })

  const handleFormSubmit = (e) => {
    if (formData.old_password === "" || formData.password === "" || formData.password_confirmation === "") {
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

    resetPassword(formData)
        .then((res) => {
          if (res.status === 200) {
            MySwal.fire({
              title: "success!",
              text: "Your password reset successfully!",
              icon: "success",
              customClass: {
                confirmButton: "btn btn-primary"
              },
              buttonsStyling: false
            })

            setFormData({
                old_password: "",
                password: "",
                password_confirmation: ""
            })
            setOpen(false)
          }
        })
        .catch((err) => {
          MySwal.fire({
            title: "warning!",
            text: "Your password reset failed!",
            icon: "warning",
            customClass: {
              confirmButton: "btn btn-primary"
            },
            buttonsStyling: false
          })
    })
  }

  const sectionLevelEdit = (e, fieldName) => {
    setFormData((oldList) => {
      const newList = JSON.parse(JSON.stringify(oldList))
      const getField = fieldName.dlevel
      newList[getField] = fieldName.f_val
      return newList
    })
  }

  useEffect(() => {
    
  }, [])

  return (
    <div>
      <Modal
        isOpen={open}
        toggle={() => setOpen(!open)}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={() => setOpen(!open)}>
          Reset Password
        </ModalHeader>
        <ModalBody>
        <div className="mb-2">
            <Label className="form-label" for="email">
              Old Password:
            </Label>
            <Input
              type="text"
              id="newPass"
              onChange={(e) =>
                sectionLevelEdit(e, {
                  dlevel: "old_password",
                  f_val: e.target.value
                })
              }
              value={formData.book_name}
              placeholder="Old Password"
            />
          </div>
          <div className="mb-2">
            <Label className="form-label" for="email">
              New Password:
            </Label>
            <Input
              type="text"
              id="newPass"
              onChange={(e) =>
                sectionLevelEdit(e, {
                  dlevel: "password",
                  f_val: e.target.value
                })
              }
              value={formData.book_name}
              placeholder="New Password"
            />
          </div>
          <div className="mb-2">
            <Label className="form-label" for="email">
              Confirm Password:
            </Label>
            <Input
              type="text"
              id="rePass"
              onChange={(e) =>
                sectionLevelEdit(e, {
                  dlevel: "password_confirmation",
                  f_val: e.target.value
                })
              }
              value={formData.book_name}
              placeholder="Confirm Password"
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
  )
}

export default PasswordResetModal
