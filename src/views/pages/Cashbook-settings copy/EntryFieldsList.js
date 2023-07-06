// ** Icons Imports
import { Copy, MoreVertical, Edit2, Trash2 } from "react-feather";
import { Link } from "react-router-dom";
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

const data = [
  {
    type: "Full Access",
    name: "Contact",
    key: "23eaf7f0-f4f7-495e-8b86-fad3261282ac",
    date: "Rename, Delete, Reorder, Add New or Hide",
    link: "contact",
  },
  {
    type: "Read Only",
    name: "Category",
    key: "bb98e571-a2e2-4de8-90a9-2e231b5e99",
    date: "Rename, Delete, Reorder, Add New or Hide",
    link: "category",
  },
  {
    type: "Full Access",
    name: "Payment Mode",
    key: "2e915e59-3105-47f2-8838-6e46bf83b711",
    date: "Rename, Delete, Reorder, Add New or Hide",
    link: "payment-mode",
  },
];

const EntryFieldsList = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">Entry Feilds</CardTitle>
      </CardHeader>
      <CardBody>
        <Row className="gy-2">
          {data.map((item) => (
            <Col sm={12} key={item.key}>
              <Link to={item.link}>
                <div className="bg-light-secondary position-relative rounded p-2">
                  <div className="d-flex align-items-center flex-wrap">
                    <h4 className="mb-1 me-1">{item.name}</h4>
                  </div>
                  <span>{item.date}</span>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </CardBody>
    </Card>
  );
};

export default EntryFieldsList;
