// ** Link Element
import { Link } from "react-router-dom"
import {
  Folder,
  MoreVertical,
  Edit,
  FileText,
  Archive,
  Trash,
  Box
} from "react-feather"
// ** Custom Components
import Avatar from "@components/avatar"

// ** Third Party Components

// ** Reactstrap Imports
import {
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap"

// ** Vars
const states = [
  "success",
  "danger",
  "warning",
  "info",
  "dark",
  "primary",
  "secondary"
]

const status = {
  1: { title: "Current", color: "light-primary" },
  2: { title: "Professional", color: "light-success" },
  3: { title: "Rejected", color: "light-danger" },
  4: { title: "Resigned", color: "light-warning" },
  5: { title: "Applied", color: "light-info" }
}

export const data = []

// ** Get initial Data
// axios.get('/api/datatables/initial-data').then(response => {
//   data = response.data
// })

// ** Table Zero Config Column
export const basicColumns = []
// ** Table ReOrder Column
export const reOrderColumns = []

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
  )
}

function dateDiff(data) {
  const today = new Date()
  const targetDate = new Date(data) // Replace with your target date

  const differenceInMilliseconds = targetDate - today
  const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24))

  return Math.abs(differenceInDays)
}

function convertDaysToFormat(totalDays) {
  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);
  const days = (totalDays % 365) % 30;

  let result = '';

  if (years > 0) {
    result += years + ' year' + (years > 1 ? 's' : '') + ' ';
  }
  if (months > 0) {
    result += months + ' month' + (months > 1 ? 's' : '') + ' ';
  }
  if (days > 0) {
    result += days + ' day' + (days > 1 ? 's' : '') + ' ';
  }

  return result.trim();
}

function calculateTimeDifference(startDate, endDate) {
  const diffInMilliseconds = Math.abs(endDate - startDate);
  const hours = Math.floor(diffInMilliseconds / 3600000);
  const minutes = Math.floor((diffInMilliseconds % 3600000) / 60000);
  const seconds = Math.floor((diffInMilliseconds % 60000) / 1000);

  let timeString = '';

  if (hours > 0) {
    timeString += hours + ' hour' + (hours > 1 ? 's' : '') + ' ';
  }
  if (minutes > 0) {
    timeString += minutes + ' minute' + (minutes > 1 ? 's' : '') + ' ';
  }
  if (seconds > 0) {
    timeString += seconds + ' second' + (seconds > 1 ? 's' : '');
  }

  return timeString.trim();
}


// ** Table Common Column
export const columns = [
  {
    name: "Cashbook Name",
    minWidth: "70%",
    sortable: (row) => row.id,
    cell: (row) => (
      
      <Link to={`/book/${row.id}/transactions`}>
        <div className="d-flex align-items-center">
          <Box />
          <div className="user-info text-truncate ms-1">
            <span className="d-block fw-bold text-truncate">{row.name}</span>
            <small>{dateDiff(row.updated_at)==1? `Updated Today`: `Updated ${convertDaysToFormat(dateDiff(row.updated_at))} ago`} </small>
          </div>
        </div>
      </Link>
    ),
    center:false
  }
]

// ** Table Intl Column
export const multiLingColumns = [
  {
    name: "Name",
    sortable: true,
    minWidth: "200px",
    selector: (row) => row.full_name
  },
  {
    name: "Position",
    sortable: true,
    minWidth: "250px",
    selector: (row) => row.post
  },
  {
    name: "Email",
    sortable: true,
    minWidth: "250px",
    selector: (row) => row.email
  },
  {
    name: "Date",
    sortable: true,
    minWidth: "150px",
    selector: (row) => row.start_date
  },

  {
    name: "Salary",
    sortable: true,
    minWidth: "150px",
    selector: (row) => row.salary
  },
  {
    name: "Status",
    sortable: true,
    minWidth: "150px",
    selector: (row) => row.status,
    cell: (row) => {
      return (
        <Badge color={status[row.status].color} pill>
          {status[row.status].title}
        </Badge>
      )
    }
  },
  {
    name: "Actions",
    allowOverflow: true,
    cell: () => {
      return (
        <div className="d-flex">
          <UncontrolledDropdown>
            <DropdownToggle className="pe-1" tag="span">
              <MoreVertical size={15} />
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem>
                <FileText size={15} />
                <span className="align-middle ms-50">Details</span>
              </DropdownItem>
              <DropdownItem>
                <Archive size={15} />
                <span className="align-middle ms-50">Archive</span>
              </DropdownItem>
              <DropdownItem>
                <Trash size={15} />
                <span className="align-middle ms-50">Delete</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <Edit size={15} />
        </div>
      )
    }
  }
]

// ** Table Server Side Column
export const serverSideColumns = [
  {
    sortable: true,
    name: "Full Name",
    minWidth: "225px",
    selector: (row) => row.full_name
  },
  {
    sortable: true,
    name: "Email",
    minWidth: "250px",
    selector: (row) => row.email
  },
  {
    sortable: true,
    name: "Position",
    minWidth: "250px",
    selector: (row) => row.post
  },
  {
    sortable: true,
    name: "Office",
    minWidth: "150px",
    selector: (row) => row.city
  },
  {
    sortable: true,
    name: "Start Date",
    minWidth: "150px",
    selector: (row) => row.start_date
  },
  {
    sortable: true,
    name: "Salary",
    minWidth: "150px",
    selector: (row) => row.salary
  }
]

// ** Table Adv Search Column
export const advSearchColumns = [
  {
    name: "Name",
    sortable: true,
    minWidth: "200px",
    selector: (row) => row.full_name
  },
  {
    name: "Email",
    sortable: true,
    minWidth: "250px",
    selector: (row) => row.email
  },
  {
    name: "Post",
    sortable: true,
    minWidth: "250px",
    selector: (row) => row.post
  },
  {
    name: "City",
    sortable: true,
    minWidth: "150px",
    selector: (row) => row.city
  },
  {
    name: "Date",
    sortable: true,
    minWidth: "150px",
    selector: (row) => row.start_date
  },

  {
    name: "Salary",
    sortable: true,
    minWidth: "100px",
    selector: (row) => row.salary
  }
]

export default ExpandableTable
