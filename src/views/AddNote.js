// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Col,
  Input,
  Form,
  Button,
  Label,
  Row,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import { AddNewNote, FetchBusinessRelatedData } from "@apifile";
import { useState, useEffect } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useDispatch, useSelector } from "react-redux";
import { handleLogin } from "@store/authentication";

const MySwal = withReactContent(Swal);

// ** Third Party Components
import Flatpickr from "react-flatpickr";

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { Calendar } from "react-feather";

const AddNote = () => {
  const dispatch = useDispatch();
  const userdata = useSelector((state) => state.authentication.userData);
  const [Picker, setPicker] = useState(new Date());
  const [formData, setFormData] = useState({
    date: Picker,
    title: "",
    user_id: "",
    description: "",
  });
  const handleFormSubmit = () => {
    if (
      formData.title === "" ||
      formData.user_id === "" ||
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

    AddNewNote(formData)
      .then((res) => {
        if (res.status === 200) {
          MySwal.fire({
            title: "success!",
            text: "Your note added successfully!",
            icon: "success",
            customClass: {
              confirmButton: "btn btn-primary",
            },
            buttonsStyling: false,
          });

          window.location.reload();
        }
      })
      .catch((err) => err);
  };

  const sectionLevelEdit = (e, fieldName) => {
    setFormData((oldList) => {
      const newList = JSON.parse(JSON.stringify(oldList));
      const getField = fieldName.dlevel;
      newList[getField] = fieldName.f_val;
      return newList;
    });
  };

  const fetchData = () => {
    FetchBusinessRelatedData()
      .then((res) => {
        if (res.status === 200) {
          setPageData((oldList) => {
            const newList = JSON.parse(JSON.stringify(oldList));
            newList.businessCategory = res.data.businessCategory;
            newList.businessTypes = res.data.businessTypes;
            return newList;
          });
          // redux
          const CustomUserdata = {
            id: userdata.id,
            name: userdata.name,
            email: userdata.email,
            phone: userdata.phone,
            accessToken: userdata.accessToken,
            avatar: userdata.avatar,
            refreshToken: userdata.refreshToken,
            role: userdata.role,
            sidebar: res.data.businessList,
          };
          const userUpdateData = {
            ...CustomUserdata,
            accessToken: userdata.accessToken,
            refreshToken: userdata.refreshToken,
            sidebar: res.data.businessList,
          };
          dispatch(handleLogin(userUpdateData));
        }
      })
      .catch((err) => err);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">Add New Note</CardTitle>
      </CardHeader>

      <CardBody>
        <Row className="mb-1">
          <Label sm="3" for="note-date">
            Date
          </Label>
          <Col sm="9">
            <InputGroup>
              <InputGroupText>
                <Calendar size={15} />
              </InputGroupText>
              <Flatpickr
                className="form-control"
                id="note-date"
                value={Picker}
                onChange={(date) => setPicker(date)}
              />
            </InputGroup>
          </Col>
        </Row>

        <Row className="mb-1">
          <Label sm="3" for="title">
            Title*
          </Label>
          <Col sm="9">
            <Input
              type="text"
              name="title"
              id="title"
              placeholder="Note Title"
              onChange={(e) =>
                sectionLevelEdit(e, { dlevel: "title", f_val: e.target.value })
              }
            />
          </Col>
        </Row>

        <Row className="mb-1">
          <Label sm="3" for="user_id">
            User ID*
          </Label>
          <Col sm="9">
            <Input
              type="text"
              name="user_id"
              id="user_id"
              placeholder="User ID"
              onChange={(e) =>
                sectionLevelEdit(e, {
                  dlevel: "user_id",
                  f_val: e.target.value,
                })
              }
            />
          </Col>
        </Row>

        <Row className="mb-1">
          <Label sm="3" for="desc">
            Description
          </Label>
          <Col sm="9">
            <Input
              type="textarea"
              id="desc"
              placeholder=""
              onChange={(e) =>
                sectionLevelEdit(e, {
                  dlevel: "description",
                  f_val: e.target.value,
                })
              }
            />
          </Col>
        </Row>

        <Row>
          <Col className="d-flex" md={{ size: 9, offset: 3 }}>
            <Button
              className="me-1"
              color="primary"
              type="submit"
              onClick={() => handleFormSubmit()}
            >
              Submit
            </Button>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default AddNote;
