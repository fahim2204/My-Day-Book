// ** Icons Imports
import { Copy, MoreVertical, Edit2, Trash2 } from "react-feather";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
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
} from "reactstrap";
import { getBusinessDataById, deleteBusiness } from "@apifile";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useDispatch, useSelector } from "react-redux";
import { handleLogout } from "@store/authentication";

const MySwal = withReactContent(Swal);

const EntryFieldsList = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.authentication);
  const { param_id } = useParams();
  const [pageData, setPageData] = useState([]);
  const logout = () => {
    dispatch(handleLogout());
  };
  const handleDeleteRow = (e, data, bookName) => {
    let bname = "Copy Business name : " + bookName;
    MySwal.fire({
      title: bname,
      input: "text",
      customClass: {
        input: "mx-1",
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-danger ms-1",
      },
      buttonsStyling: false,
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: false,
      confirmButtonText: "Confirm",
      showLoaderOnConfirm: true,
      preConfirm(login) {
        if (login == bookName) {
          return {value:true};
        } else {
          MySwal.showValidationMessage(`Business Name doesn't match!`);
        }

        // return fetch(`//api.github.com/users/${login}`)
        //   .then(function (response) {
        //     if (!response.ok) {
        //       throw new Error(response.statusText)
        //     }
        //     return response.json()
        //   })
        //   .catch(function (error) {
        //     MySwal.showValidationMessage(`Request failed:  ${error}`)
        //   })
      },
    }).then(function (result) {
      if (result.value) {
        deleteBusiness({ id: data })
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
              logout();
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
      } else {
        MySwal.fire({
          title: "warning!",
          text: "no match",
          icon: "warning",
          customClass: {
            confirmButton: "btn btn-primary",
          },
          buttonsStyling: false,
        });
      }
    });
  };

  const fetchData = async () => {
    getBusinessDataById(param_id)
      .then((res) => {
        if (res.status === 200) {
          setPageData(res.businesses);
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
        <CardTitle tag="h4">Business Settings</CardTitle>
      </CardHeader>
      <CardBody>
        <Row className="gy-2">
          <Col sm={12}>
            <Link to={"/users"} >
            <div className="bg-light-secondary position-relative rounded p-2">
              <div className="d-flex align-items-center flex-wrap">
                <h4 className="mb-1 me-1">Business Team</h4>
              </div>
              <span></span>
            </div>
            </Link>
          </Col>

          {/* <Col sm={12}>
            <div className="bg-light-secondary position-relative rounded p-2">
              <div className="d-flex align-items-center flex-wrap">
                <h4 className="mb-1 me-1">Business Profile</h4>
              </div>
              <span></span>
            </div>
          </Col> */}

          <Col sm={12}>
            <div className="bg-light-secondary position-relative rounded p-2">
              <div className="d-flex align-items-center flex-wrap">
                <h4 className="mb-1 me-1">Settings</h4>
              </div>
              <Badge
                color="light-danger"
                onClick={(e) => handleDeleteRow(e, pageData.id, pageData.name)}
              >
                Delete Business Account <Trash2 size={15} />
              </Badge>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default EntryFieldsList;
