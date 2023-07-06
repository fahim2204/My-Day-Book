// ** Link Element
import { Link } from "react-router-dom";
import {
  Folder,
  MoreVertical,
  Edit,
  FileText,
  Archive,
  Trash,
} from "react-feather";
// ** Custom Components
import Avatar from "@components/avatar";

// ** Reactstrap Imports
import {
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

// ** Vars
// const states = ['success', 'danger', 'warning', 'info', 'dark', 'primary', 'secondary']

// const status = {
//   1: { title: 'Current', color: 'light-primary' },
//   2: { title: 'Professional', color: 'light-success' },
//   3: { title: 'Rejected', color: 'light-danger' },
//   4: { title: 'Resigned', color: 'light-warning' },
//   5: { title: 'Applied', color: 'light-info' }
// }

export const data = [];

// ** Get initial Data
// axios.get('/api/datatables/initial-data').then(response => {
//   data = response.data
// })

// ** Table Zero Config Column
export const basicColumns = [];
// ** Table ReOrder Column
export const reOrderColumns = [];

// ** Expandable table component
const ExpandableTable = ({ data }) => {
  return (
    <div className="expandable-content p-2">
      <p>
        <span className="fw-bold">City:</span> {data.city}
      </p>
      <p>
        <span className="fw-bold">Experience:</span> {data.experience}
      </p>
      <p className="m-0">
        <span className="fw-bold">Post:</span> {data.post}
      </p>
    </div>
  );
};

// ** Formate Date

function formateDate(date) {
  date = new Date(date);

  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return formattedDate;
}

// ** Table Common Column
export const columns = [
  {
    name: "Date & Time",
    cell: (row) => (
      <div className="user-info text-truncate">
        <span className="d-block fw-bold text-truncate">
          {formateDate(row.date)}
        </span>
        <small>{row.time}</small>
      </div>
    ),
  },
  {
    name: "Details",
    minWidth: "15%",
    cell: (row) => (
      <span className="d-block fw-bold text-truncate">
        {row?.description || "---"}
      </span>
    ),
  },
  {
    name: "Transaction Type",
    cell: (row) => (
      <span className="d-block fw-bold text-truncate">{row?.typeName}</span>
    ),
  },
  {
    name: "Contact Name",
    cell: (row) => (
      <span className="d-block fw-bold text-truncate">{row?.contactName}</span>
    ),
  },
  {
    name: "Transaction Category",
    cell: (row) => (
      <span className="d-block fw-bold text-truncate">
        {row?.transactionCategoryName}
      </span>
    ),
  },
  {
    name: "Payment Mode",
    cell: (row) => (
      <span className="d-block fw-bold text-truncate">{row?.methodName}</span>
    ),
  },
  {
    name: "Doccument",
    minWidth: "12%",
    cell: (row) => (
      <>
        {row.documentFile &&
          row.documentFile.map((item, index) => {
            return (
              <>
                <Link
                  to={
                    "http://www.apiserver.mydaybookk.com/uploads/images/" + item
                  }
                  target="_blank"
                >
                  {"file-" + (index + 1)}
                </Link>{" "}
                ,
              </>
            );
          })}
      </>
    ),
  },
  {
    name: "Page No",
    cell: (row) => (
      <span className="d-block fw-bold text-truncate">{row?.page_no}</span>
    ),
  },
  {
    name: "Amount",
    cell: (row) => (
      <>
        {row.type === "cashIn" ? (
          <>
            <span
              className="d-block fw-bold text-truncate text-red"
              style={{ color: "green" }}
            >
              {row?.amount}
            </span>
          </>
        ) : (
          <>
            <span
              className="d-block fw-bold text-truncate text-red"
              style={{ color: "red" }}
            >
              {row?.amount}
            </span>
          </>
        )}
      </>
    ),
  },
  {
    name: "Balance",
    cell: (row) => (
      <span className="d-block fw-bold text-truncate">{row?.balance}</span>
    ),
  },
];

// ** Notes Column
export const noteColumns = [
  {
    name: "Date",
    cell: (row) => (
      <div className="user-info text-truncate">
        <span className="d-block fw-bold text-truncate">
          {formateDate(row.date)}
        </span>
      </div>
    ),
  },
  {
    name: "Title",
    cell: (row) => (
      <span className="d-block fw-bold text-truncate">{row?.title}</span>
    ),
  },
  {
    name: "Details",
    minWidth: "15%",
    cell: (row) => (
      <span className="d-block fw-bold text-truncate">
        {row?.description || "---"}
      </span>
    ),
  },
];

export default ExpandableTable;
