// ** React Imports
import { Fragment, useState, forwardRef } from "react";
import { Link } from "react-router-dom";
// ** Table Data & Columns
import { data, columns } from "./data";
import { deleteCashBook } from "@apifile";
// ** Add New Modal Component
import AddNewModal from "@components/modals/TransactionDetailsAddModal";

// ** Third Party Components
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import {
  ChevronDown,
  Share,
  Printer,
  FileText,
  File,
  Grid,
  Copy,
  Plus,
  Folder,
  MoreVertical,
  Edit,
  Archive,
  Trash,
} from "react-feather";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Input,
  Label,
  Button,
  CardTitle,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledButtonDropdown,
  UncontrolledDropdown,
} from "reactstrap";
import { useSelector } from "react-redux";
// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
  <div className="form-check">
    <Input type="checkbox" ref={ref} {...props} />
  </div>
));

const DataTableWithButtons = ({
  pageData,
  setEditModal,
  fetchData,
  handleEdit,
  quickAdd,
  businessName,
}) => {
  // ** States
  const [modal, setModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const userdata = useSelector((state) => state.authentication.userData);
  // ** Function to handle Modal toggle
  const handleModal = () => setModal(!modal);

  // ** Function to handle filter
  const handleFilter = (e) => {
    const value = e.target.value;
    let updatedData = [];
    setSearchValue(value);

    const status = {
      1: { title: "Current", color: "light-primary" },
      2: { title: "Professional", color: "light-success" },
      3: { title: "Rejected", color: "light-danger" },
      4: { title: "Resigned", color: "light-warning" },
      5: { title: "Applied", color: "light-info" },
    };

    if (value.length) {
      updatedData = data.filter((item) => {
        const startsWith =
          item.full_name.toLowerCase().startsWith(value.toLowerCase()) ||
          item.post.toLowerCase().startsWith(value.toLowerCase()) ||
          item.email.toLowerCase().startsWith(value.toLowerCase()) ||
          item.age.toLowerCase().startsWith(value.toLowerCase()) ||
          item.salary.toLowerCase().startsWith(value.toLowerCase()) ||
          item.start_date.toLowerCase().startsWith(value.toLowerCase()) ||
          status[item.status].title
            .toLowerCase()
            .startsWith(value.toLowerCase());

        const includes =
          item.full_name.toLowerCase().includes(value.toLowerCase()) ||
          item.post.toLowerCase().includes(value.toLowerCase()) ||
          item.email.toLowerCase().includes(value.toLowerCase()) ||
          item.age.toLowerCase().includes(value.toLowerCase()) ||
          item.salary.toLowerCase().includes(value.toLowerCase()) ||
          item.start_date.toLowerCase().includes(value.toLowerCase()) ||
          status[item.status].title.toLowerCase().includes(value.toLowerCase());

        if (startsWith) {
          return startsWith;
        } else if (!startsWith && includes) {
          return includes;
        } else return null;
      });
      setFilteredData(updatedData);
      setSearchValue(value);
    }
  };

  // ** Function to handle Pagination
  const handlePagination = (page) => {
    setCurrentPage(page.selected);
  };

  // ** Custom Pagination
  const CustomPagination = () => (
    <ReactPaginate
      previousLabel=""
      nextLabel=""
      forcePage={currentPage}
      onPageChange={(page) => handlePagination(page)}
      pageCount={
        searchValue.length
          ? Math.ceil(filteredData.length / 7)
          : Math.ceil(pageData.length / 7) || 1
      }
      breakLabel="..."
      pageRangeDisplayed={2}
      marginPagesDisplayed={2}
      activeClassName="active"
      pageClassName="page-item"
      breakClassName="page-item"
      nextLinkClassName="page-link"
      pageLinkClassName="page-link"
      breakLinkClassName="page-link"
      previousLinkClassName="page-link"
      nextClassName="page-item next-item"
      previousClassName="page-item prev-item"
      containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1"
    />
  );

  // ** Converts table to CSV
  function convertArrayOfObjectsToCSV(array) {
    let result;

    const columnDelimiter = ",";
    const lineDelimiter = "\n";
    const keys = Object.keys(data[0]);

    result = "";
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach((item) => {
      let ctr = 0;
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];

        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }

  // ** Downloads CSV
  function downloadCSV(array) {
    const link = document.createElement("a");
    let csv = convertArrayOfObjectsToCSV(array);
    if (csv === null) return;

    const filename = "export.csv";

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", filename);
    link.click();
  }

  const handleDeleteRow = (e, data, bookName) => {
    let bname = "Copy cashbook name : " + bookName;
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
          MySwal.showValidationMessage(`Cashbook Name doesn't match!`);
        }
      },
    }).then(function (result) {
      if (result.value) {
        deleteCashBook({ id: data })
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
              fetchData();
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

  const updatedColumns = [
    ...columns,
    {
      name: "Actions",
      allowOverflow: true,
      cell: (row) => {
        return (
          <div className="d-flex justify-content-center w-100">
            <UncontrolledDropdown>
              <DropdownToggle className="pe-1" tag="span">
                <MoreVertical size={15} />
              </DropdownToggle>
              <DropdownMenu end>
                <Link to={`/book/${row.id}/transactions`}>
                  <DropdownItem className="w-100">
                    <FileText size={15} />
                    <span className="align-middle ms-50">Details</span>
                  </DropdownItem>
                </Link>
                {(row?.permissions_id == 1 || userdata.role_id != 3) && (
                  <DropdownItem
                    className="w-100"
                    onClick={(e) => handleDeleteRow(e, row.id, row.name)}
                  >
                    <Trash size={15} />
                    <span className="align-middle ms-50">Delete</span>
                  </DropdownItem>
                )}
              </DropdownMenu>
            </UncontrolledDropdown>

            {(row?.permissions_id != 3 || userdata.role_id != 3) && (
              <Edit size={15} onClick={(e) => handleEdit(row)} />
            )}
          </div>
        );
      },
      center:false
    },
  ];

  return (
    <Fragment>
      <Card>
        <CardHeader className="flex-md-row flex-column align-md-items-center align-items-start border-bottom">
          <CardTitle tag="h4">{businessName}</CardTitle>
          <div className="d-flex mt-md-0 mt-1">
            {userdata.role_id != 3 && (
              <>
                <Button
                  className="ms-2"
                  color="primary"
                  onClick={() => quickAdd("")}
                >
                  <Plus size={15} />
                  <span className="align-middle ms-50">Add New Book</span>
                </Button>
              </>
            )}
          </div>
        </CardHeader>
        {/* <Row className='justify-content-start align-items-center mx-0'>
            <Col className='d-flex align-items-center mt-1' md='3' sm='12'>
                <Label className='me-1' for='search-input'>
                    Search
                </Label>
                <Input
                    className='dataTable-filter mb-50'
                    type='text'
                    bsSize='sm'
                    id='search-input'
                    value={searchValue}
                    onChange={handleFilter}
                    style={{ height: "38px", margin: "10px 0 0"  }}
                />
            </Col>
            <Col className='mt-1' md='4' sm='12'>
            <UncontrolledButtonDropdown>
                <DropdownToggle outline color='primary' caret>
                    Sort By: <span>Last Updated</span>
                </DropdownToggle>
                <DropdownMenu>
                <DropdownItem  onClick={e => e.preventDefault()}>
                    Name(A to Z)
                </DropdownItem>
                <DropdownItem  onClick={e => e.preventDefault()}>
                   Last Created
                </DropdownItem>
                
                </DropdownMenu>
            </UncontrolledButtonDropdown>
          </Col>
        </Row> */}
        <div className="react-dataTable react-dataTable-selectable-rows">
          <DataTable
            noHeader
            pagination
            // selectableRows
            columns={updatedColumns}
            paginationPerPage={7}
            className="react-dataTable"
            sortIcon={<ChevronDown size={10} />}
            paginationComponent={CustomPagination}
            paginationDefaultPage={currentPage + 1}
            // selectableRowsComponent={BootstrapCheckbox}
            data={searchValue.length ? filteredData : pageData}
            expandableRowsComponentProps={setEditModal}
          />
          <br />
          <br />
        </div>
      </Card>
      <AddNewModal open={modal} handleModal={handleModal} />
    </Fragment>
  );
};

export default DataTableWithButtons;
