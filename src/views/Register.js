// ** React Imports
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

// ** Sweet Alert
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

// ** Custom Hooks
import { useSkin } from "@hooks/useSkin";

// ** Icons Imports
import { Facebook, Twitter, Mail, GitHub, Coffee } from "react-feather";

// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";
import logo from "@src/assets/images/logo/logo.png";
// ** Reactstrap Imports
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Form,
  Label,
  Input,
  Button,
} from "reactstrap";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/register-v2.svg";
import illustrationsDark from "@src/assets/images/pages/register-v2-dark.svg";

// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { useState } from "react";

// ** Custom Hooks
import useJwt from "@src/auth/jwt/useJwt";

// ** Actions
import { handleLogin } from "@store/authentication";

// ** Utils
import { getHomeRouteForLoggedInUser } from "@utils";

// ** Custom Components
import Avatar from "@components/avatar";

const ToastContent = ({ t, name, role }) => {
  return (
    <div className="d-flex">
      <div className="me-1">
        <Avatar size="sm" color="success" icon={<Coffee size={12} />} />
      </div>
      <div className="d-flex flex-column">
        <div className="d-flex justify-content-between">
          <h6>{name}</h6>
          {/* <X
            size={12}
            className="cursor-pointer"
            onClick={() => toast.dismiss(t.id)}
          /> */}
        </div>
        <span>
          You have successfully logged in as an {role} user to Vuexy. Now you
          can start to explore. Enjoy!
        </span>
      </div>
    </div>
  );
};

const Register = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [registerData, setRegisterData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  // ** Handle Form Data Change
  const handleInput = (e) => {
    setRegisterData((oldList) => {
      const newList = { ...oldList };
      newList[e.target.name] = e.target.value;
      return newList;
    });
  };

  const submitData = async () => {
    useJwt
      .register({ ...registerData })
      .then((res) => {
        const data = {
          ...res.userData,
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
        };

        dispatch(handleLogin(data));

        // return false;
        navigate(getHomeRouteForLoggedInUser(data.role));
        toast((t) => (
          <ToastContent
            t={t}
            role={data.role || "admin"}
            name={data.fullName || data.username || "John Doe"}
          />
        ));
      })
      .catch((err) => console.log(err.message));
  };

  // ** Hooks
  const { skin } = useSkin();

  const source = skin === "dark" ? illustrationsDark : illustrationsLight;

  return (
    <div className="auth-wrapper auth-cover">
      <Row className="auth-inner m-0">
        <Link className="brand-logo" to="/" onClick={(e) => e.preventDefault()}>
          <img
            className="fallback-logo"
            style={{ width: "34px" }}
            src={logo}
            alt="logo"
          />
          <h2 className="brand-text text-primary ms-1">My Day Book</h2>
        </Link>
        <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img className="img-fluid" src={source} alt="Login Cover" />
          </div>
        </Col>
        <Col
          className="d-flex align-items-center auth-bg px-2 p-lg-5"
          lg="4"
          sm="12"
        >
          <Col className="px-xl-2 mx-auto" xs="12" sm="8" md="6" lg="12">
            <CardTitle tag="h2" className="fw-bold mb-1">
              Adventure starts here 🚀
            </CardTitle>
            <CardText className="mb-2">
              Make your app management easy and fun!
            </CardText>
            <Form
              className="auth-register-form mt-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="mb-1">
                <Label className="form-label" for="register-username">
                  Username
                </Label>
                <Input
                  type="text"
                  name="name"
                  id="register-username"
                  placeholder="johndoe"
                  autoFocus
                  onChange={(e) => handleInput(e)}
                />
              </div>
              <div className="mb-1">
                <Label className="form-label" for="register-email">
                  Email
                </Label>
                <Input
                  type="email"
                  name="email"
                  id="register-email"
                  placeholder="john@example.com"
                  onChange={(e) => handleInput(e)}
                />
              </div>
              <div className="mb-1">
                <Label className="form-label" for="register-email">
                  Phone
                </Label>
                <Input
                  type="phone"
                  name="phone"
                  id="register-phone"
                  placeholder="xxxxx-xxxxxxx"
                  onChange={(e) => handleInput(e)}
                />
              </div>
              <div className="mb-1">
                <Label className="form-label" for="register-password">
                  Password
                </Label>
                <InputPasswordToggle
                  className="input-group-merge"
                  id="register-password"
                  name="password"
                  onChange={(e) => handleInput(e)}
                />
              </div>
              <div className="form-check mb-1">
                <Input type="checkbox" id="terms" />
                <Label className="form-check-label" for="terms">
                  I agree to
                  <a
                    className="ms-25"
                    href="/"
                    onClick={(e) => e.preventDefault()}
                  >
                    privacy policy & terms
                  </a>
                </Label>
              </div>
              <Button color="primary" block onClick={submitData}>
                Sign up
              </Button>
            </Form>
            <p className="text-center mt-2">
              <span className="me-25">Already have an account?</span>
              <Link to="/login">
                <span>Sign in instead</span>
              </Link>
            </p>
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
