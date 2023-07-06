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
} from "reactstrap";
import { AddNewBusiness, FetchBusinessRelatedData } from "@apifile";
import { useState, useEffect } from "react";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useDispatch, useSelector } from "react-redux";
import { handleLogin } from "@store/authentication";

const MySwal = withReactContent(Swal);

const AddBusiness = () => {
  const dispatch = useDispatch();
  const userdata = useSelector((state) => state.authentication.userData);
  const [formData, setFormData] = useState({
    name: "",
    business_category_id: "",
    business_type_id: "",
  });
  const [pageData, setPageData] = useState({
    businessCategory: [],
    businessTypes: [],
  });
  const handleFormSubmit = (e) => {
    if (
      formData.name == "" ||
      formData.business_category_id == "" ||
      formData.business_type_id == ""
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

    AddNewBusiness(formData)
      .then((res) => {
        if (res.status === 200) {
          MySwal.fire({
            title: "success!",
            text: "Your business created successfully!",
            icon: "success",
            customClass: {
              confirmButton: "btn btn-primary",
            },
            buttonsStyling: false,
          });

          fetchData();
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
      console.log("...", newList);
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
    console.log("state", userdata);
    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">Create New Business</CardTitle>
      </CardHeader>

      <CardBody>
        <Row className="mb-1">
          <Label sm="3" for="name">
            Business Name*
          </Label>
          <Col sm="9">
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Business Name"
              onChange={(e) =>
                sectionLevelEdit(e, {
                  dlevel: "name",
                  f_val: e.target.value,
                })
              }
            />
          </Col>
        </Row>

        <Row className="mb-1">
          <Label sm="3" for="name">
            Business Category*
          </Label>
          <Col sm="9">
            <Select
              theme={selectThemeColors}
              className="react-select"
              classNamePrefix="select"
              options={pageData.businessCategory}
              isClearable={false}
              onChange={(e) =>
                sectionLevelEdit(e, {
                  dlevel: "business_category_id",
                  f_val: e.value,
                })
              }
            />
          </Col>
        </Row>

        <Row className="mb-1">
          <Label sm="3" for="name">
            Business Types*
          </Label>
          <Col sm="9">
            <Select
              theme={selectThemeColors}
              className="react-select"
              classNamePrefix="select"
              options={pageData.businessTypes}
              isClearable={false}
              onChange={(e) =>
                sectionLevelEdit(e, {
                  dlevel: "business_type_id",
                  f_val: e.value,
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
              onClick={(e) => handleFormSubmit()}
            >
              Submit
            </Button>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};
export default AddBusiness;
