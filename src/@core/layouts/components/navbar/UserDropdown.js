// ** React Imports
import { useState } from "react";
import { Link } from "react-router-dom";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Third Party Components
import {
  User,
  Mail,
  CheckSquare,
  MessageSquare,
  Settings,
  CreditCard,
  HelpCircle,
  Power,
} from "react-feather";

// ** Reactstrap Imports
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from "reactstrap";

// ** Import Modal
import PasswordResetModal from "../../../components/modals/PasswordReset";

// ** Default Avatar Image
import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg";
import { useDispatch, useSelector } from "react-redux";
// ** Actions
import { handleLogout } from "@store/authentication";
const UserDropdown = () => {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.authentication);
  const logout = () => {
    dispatch(handleLogout());
  };

  return (
    <>
      <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
        <DropdownToggle
          href="/"
          tag="a"
          className="nav-link dropdown-user-link"
          onClick={(e) => e.preventDefault()}
        >
          <div className="user-nav d-sm-flex d-none">
            <span className="user-name fw-bold">{userData.name}</span>
            <span className="user-status">{userData.role}</span>
          </div>
          <Avatar
            img={defaultAvatar}
            imgHeight="40"
            imgWidth="40"
            status="online"
          />
        </DropdownToggle>
        <DropdownMenu end>
          {/* <DropdownItem tag={Link} to="/" onClick={(e) => e.preventDefault()}>
            <User size={14} className="me-75" />
            <span className="align-middle">Profile</span>
          </DropdownItem>
          <DropdownItem tag={Link} to="/" onClick={(e) => e.preventDefault()}>
            <Mail size={14} className="me-75" />
            <span className="align-middle">Inbox</span>
          </DropdownItem>
          <DropdownItem tag={Link} to="/" onClick={(e) => e.preventDefault()}>
            <CheckSquare size={14} className="me-75" />
            <span className="align-middle">Tasks</span>
          </DropdownItem>
          <DropdownItem tag={Link} to="/" onClick={(e) => e.preventDefault()}>
            <MessageSquare size={14} className="me-75" />
            <span className="align-middle">Chats</span>
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem tag={Link} to="/" onClick={(e) => e.preventDefault()}>
            <CreditCard size={14} className="me-75" />
            <span className="align-middle">Pricing</span>
          </DropdownItem>
          <DropdownItem tag={Link} to="/" onClick={(e) => e.preventDefault()}>
            <HelpCircle size={14} className="me-75" />
            <span className="align-middle">FAQ</span>
          </DropdownItem> */}
          <DropdownItem
            onClick={() => setOpen(!open)}
          >
            <Settings size={14} className="me-75" />
            <span className="align-middle">Change Password</span>
          </DropdownItem>
          <DropdownItem tag={Link} to="/" onClick={(e) => logout()}>
            <Power size={14} className="me-75" />
            <span className="align-middle">Logout</span>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
      <PasswordResetModal open={open} setOpen={setOpen}/>
    </>
    
  );
};

export default UserDropdown;
