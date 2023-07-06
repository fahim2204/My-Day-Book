// ** React Import
import { useEffect, useState } from "react";

// ** Custom Components
import Sidebar from "@components/sidebar";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Third Party Components
import Select from "react-select";
import classnames from "classnames";
import { useForm, Controller } from "react-hook-form";

// ** Reactstrap Imports
import {
  Button,
  Label,
  FormText,
  Form,
  Input,
  Table,
  UncontrolledTooltip,
  ButtonGroup,
  Row,
  Col,
  CardText,
} from "reactstrap";

// ** Store & Actions
import { addUser } from "../store";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
import { CreateNewUser } from "@apifile";
import { Info } from "react-feather";
const defaultValues = {
  email: "",
  contact: "",
  company: "",
  fullName: "",
  username: "",
  country: null,
};

const countryOptions = [
  { label: "Australia", value: "Australia" },
  { label: "Bangladesh", value: "Bangladesh" },
  { label: "Belarus", value: "Belarus" },
  { label: "Brazil", value: "Brazil" },
  { label: "Canada", value: "Canada" },
  { label: "China", value: "China" },
  { label: "France", value: "France" },
  { label: "Germany", value: "Germany" },
  { label: "India", value: "India" },
  { label: "Indonesia", value: "Indonesia" },
  { label: "Israel", value: "Israel" },
  { label: "Italy", value: "Italy" },
  { label: "Japan", value: "Japan" },
  { label: "Korea", value: "Korea" },
  { label: "Mexico", value: "Mexico" },
  { label: "Philippines", value: "Philippines" },
  { label: "Russia", value: "Russia" },
  { label: "South", value: "South" },
  { label: "Thailand", value: "Thailand" },
  { label: "Turkey", value: "Turkey" },
  { label: "Ukraine", value: "Ukraine" },
  { label: "United Arab Emirates", value: "United Arab Emirates" },
  { label: "United Kingdom", value: "United Kingdom" },
  { label: "United States", value: "United States" },
];

const checkIsValid = (data) => {
  return Object.values(data).every((field) =>
    typeof field === "object" ? field !== null : field.length > 0
  );
};

const SidebarNewUsers = ({
  open,
  toggleSidebar,
  fetchData,
  pageSidebarData,
  editData
}) => {
  // ** States
  const [data, setData] = useState(null)
  const [plan, setPlan] = useState("basic")
  const [role, setRole] = useState("3")
  const [cSelected, setCSelected] = useState([])
  const [rSelected, setRSelected] = useState([])

  const onCheckboxBtnClick = (selected) => {
    const index = cSelected.indexOf(selected)
    if (index < 0) {
      cSelected.push(selected);
    } else {
      cSelected.splice(index, 1);
    }
    setCSelected([...cSelected]);
  };

  // ** Store Vars
  const dispatch = useDispatch();

  // ** Vars
  const {
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  // ** Function to handle form submit
  const onSubmit = (data) => {
    setData(data);
    console.log("check", data, role);
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("contact", data.contact);
    formData.append("username", data.username);
    formData.append("password", data.password);
    formData.append("role", role);
    console.log("preview", typeof rSelected, rSelected);

    rSelected.forEach((item, index) => {
      formData.append(`permissions[${index}]["book"]`, item.book);
      formData.append(`permissions[${index}]["permission"]`, item.permission);
    });

    CreateNewUser(formData)
      .then((res) => {
        if (res.status === 200) {
          MySwal.fire({
            title: "success!",
            text: "User Created Successfully!",
            icon: "success",
            customClass: {
              confirmButton: "btn btn-primary",
            },
            buttonsStyling: false,
            timerProgressBar: true,
            timer: 2000,
          });

          fetchData();
        }
      })
      .catch((err) => err);
  };

  const handleSidebarClosed = () => {
    for (const key in defaultValues) {
      setValue(key, "");
    }
    setRole("subscriber");
    setPlan("basic");
  };

  const handlePermissions = (param) => {
    let dupIndex = "";
    rSelected.map((item, index) => {
      if (item.book == param.data.id) {
        dupIndex = index;
      } else {
      }
    });
    setRSelected((oldList) => {
      const newList = JSON.parse(JSON.stringify(oldList));
      if (dupIndex == "") {
        let bookName = {
          book: param.data.id,
          permission: param.permission,
        };
        newList.push(bookName);
      } else {
        newList[dupIndex].book = param.data.id;
        newList[dupIndex].permission = param.permission;
      }

      return newList;
    });
  };

  const handlePermissionsActive = (param) => {
    let check = 0;
    rSelected.forEach((item, index) => {
      if (item.book == param.data.id) {
        console.log("sec--", item.permission, param.permission);
        if (item.permission == param.permission) {
          console.log("---premission", item.permission, param.permission);
          check = 100;
        }
      }
    });
    return check;
  };

  useEffect(() => {

    if (editData.edit) {

    }

  }, [editData])

  return (
    <Sidebar
      size="lg"
      open={open}
      title="New User"
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-1">
          <Label className="form-label" for="fullName">
            Full Name <span className="text-danger">*</span>
          </Label>
          <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <Input
                id="fullName"
                placeholder="John Doe"
                invalid={errors.fullName && true}
                {...field}
              />
            )}
          />
        </div>
        <div className="mb-1">
          <Label className="form-label" for="userEmail">
            Email <span className="text-danger">*</span>
          </Label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                type="email"
                id="userEmail"
                placeholder="john.doe@example.com"
                invalid={errors.email && true}
                {...field}
              />
            )}
          />
          <FormText color="muted">
            You can use letters, numbers & periods
          </FormText>
        </div>

        <div className="mb-1">
          <Label className="form-label" for="contact">
            Contact <span className="text-danger">*</span>
          </Label>
          <Controller
            name="contact"
            control={control}
            render={({ field }) => (
              <Input
                id="contact"
                placeholder="(397) 294-5153"
                type="number"
                invalid={errors.fullName && true}
                {...field}
              />
            )}
          />
        </div>
        <div className="mb-1">
          <Label className="form-label" for="company">
            Username <span className="text-danger">*</span>
          </Label>
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <Input
                id="username"
                placeholder=""
                type="text"
                invalid={errors.fullName && true}
                {...field}
              />
            )}
          />
        </div>

        <div className="mb-1">
          <Label className="form-label" for="company">
            Password <span className="text-danger">*</span>
          </Label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                id="password"
                placeholder="***"
                type="password"
                invalid={errors.fullName && true}
                {...field}
              />
            )}
          />
        </div>
        <div className="mb-1">
          <Label className="form-label" for="user-role">
            User Role
          </Label>
          <Input
            type="select"
            id="user-role"
            name="user-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="1">Owner</option>
            <option value="2">Partner</option>
            <option value="3">Staff</option>
          </Input>
        </div>
        <hr />
        <div className="mb-1">
          <Label className="form-label" for="user-role">
            User Responsibilities and permissions
          </Label>
          <Table className="table-flush-spacing" responsive>
            <tbody>
              <tr>
                <td className="text-nowrap fw-bolder">
                  <span className="me-50"> All Books</span>
                </td>
                <td>
                  <div className="form-check">
                    <Label className="form-check-label" for="select-all">
                      Permissions
                    </Label>
                  </div>
                </td>
              </tr>
              {pageSidebarData.map((item, index) => {
                return (
                  <>
                    <tr key={index}>
                      <td className="text-nowrap fw-bolder">{item.name}</td>
                      <td>
                        <Col md="12" lg="6">
                          <ButtonGroup className="mb-1">
                            <Button
                              color="default"
                              onClick={() =>
                                handlePermissions({ data: item, permission: 1 })
                              }
                              active={
                                handlePermissionsActive({
                                  data: item,
                                  permission: 1,
                                }) == 100
                                  ? true
                                  : false
                              }
                            >
                              Admin <Info size={14} id="info-tooltip" />
                              <UncontrolledTooltip
                                placement="top"
                                target="info-tooltip"
                              >
                                Allows a full access to the assigned books
                              </UncontrolledTooltip>
                            </Button>
                            <Button
                              color="default"
                              onClick={() =>
                                handlePermissions({ data: item, permission: 2 })
                              }
                              active={
                                handlePermissionsActive({
                                  data: item,
                                  permission: 2,
                                }) == 100
                                  ? true
                                  : false
                              }
                            >
                              Data Operator{" "}
                              <Info size={14} id="operator-tooltip" />
                              <UncontrolledTooltip
                                placement="top"
                                target="operator-tooltip"
                              >
                                Allows a limited access to the assigned books
                                like view and edit
                              </UncontrolledTooltip>
                            </Button>
                            <Button
                              color="default"
                              onClick={() =>
                                handlePermissions({ data: item, permission: 3 })
                              }
                              active={
                                handlePermissionsActive({
                                  data: item,
                                  permission: 3,
                                }) == 100
                                  ? true
                                  : false
                              }
                            >
                              Viewer <Info size={14} id="view-tooltip" />
                              <UncontrolledTooltip
                                placement="top"
                                target="view-tooltip"
                              >
                                Allows a limited access and view only
                              </UncontrolledTooltip>
                            </Button>
                          </ButtonGroup>
                          <CardText>Selected: </CardText>
                        </Col>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </Table>
        </div>
        <Button type="submit" className="me-1" color="primary">
          Submit
        </Button>
        <Button type="reset" color="secondary" outline onClick={toggleSidebar}>
          Cancel
        </Button>
      </Form>
    </Sidebar>
  );
};

export default SidebarNewUsers;
