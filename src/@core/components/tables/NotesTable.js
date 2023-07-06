// ** React Imports
import { Fragment, useState, useEffect, forwardRef } from "react";

// ** Route Data
import { useParams } from "react-router-dom";

// ** Table Data & Columns
import { data, noteColumns as columns } from "./books/transtable-data";
import { deleteNote } from "@apifile";

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
  MoreVertical,
  Archive,
  Trash,
  Edit,
} from "react-feather";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

// ** Reactstrap Imports
import {
  Card,
  Input,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
  <div className="form-check">
    <Input type="checkbox" ref={ref} {...props} />
  </div>
));

const NotesTable = ({ handleEdit, filteredData, fetchData }) => {
  const { param_id } = useParams();

  // ** States
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState("");

  // ** Handle Row Delete
  const handleDeleteRow = (e, data) => {
    e.preventDefault();
    deleteNote({ id: data })
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
  };

  // ** Updated Columns
  const pathName = window.location.pathname;
  const page = pathName.substring(1);
  const updateColumns = [
    ...columns,
    {
      name: "Actions",
      allowOverflow: true,
      cell: (row) => {
        if (page !== "dashboard") {
          return (
            <div className="d-flex w-100">
              <UncontrolledDropdown>
                <DropdownToggle className="pe-1" tag="span">
                  <MoreVertical size={15} />
                </DropdownToggle>
                <DropdownMenu end>
                  <DropdownItem
                    tag="a"
                    href="/"
                    className="w-100"
                    onClick={(e) => e.preventDefault()}
                  >
                    <FileText size={15} />
                    <span className="align-middle ms-50">Details</span>
                  </DropdownItem>
                  <DropdownItem
                    tag="a"
                    href="/"
                    className="w-100"
                    onClick={(e) => handleDeleteRow(e, row.id)}
                  >
                    <Trash size={15} />
                    <span className="align-middle ms-50">Delete</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <Edit size={15} onClick={() => handleEdit(row)} />
            </div>
          );
        } else {
          return "-";
        }
      },
    },
  ];

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
          : Math.ceil(data.length / 7) || 1
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

  useEffect(() => {}, [param_id]);

  return (
    <Fragment>
      <Card>
        <div className="react-dataTable react-dataTable-selectable-rows">
          <DataTable
            noHeader
            pagination
            selectableRows
            columns={updateColumns}
            paginationPerPage={7}
            className="react-dataTable"
            sortIcon={<ChevronDown size={10} />}
            paginationComponent={CustomPagination}
            paginationDefaultPage={currentPage + 1}
            selectableRowsComponent={BootstrapCheckbox}
            data={filteredData}
          />
        </div>
      </Card>
    </Fragment>
  );
};

export default NotesTable;
