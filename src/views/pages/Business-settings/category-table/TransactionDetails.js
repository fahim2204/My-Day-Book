import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Input,
  Label,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  CardLink,
  Alert,
  Button,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledButtonDropdown,
} from "reactstrap";
import { Link, useParams } from "react-router-dom";

// ** Icons Imports
import { Plus, Minus, Menu, Settings } from "react-feather";
import AddNewModal from "@components/modals/TransactionDetailsAddModal";
import {
  transactionAddModalData,
  getCategory,
  GetTransactionData,
} from "@apifile";

// ** Table
import Table from "@components/tables/books/TransitionDetailsTable";
import { useSelector } from "react-redux";

const TransactionDetails = () => {
  // ** States
  const userdata = useSelector((state) => state.authentication.userData);
  const [searchValue, setSearchValue] = useState("");
  const [pageData, setPageData] = useState([]);
  const [editData, setEditData] = useState({});
  const [pageTransData, setPageTransData] = useState([]);
  const [filterOpts, setFilterOpts] = useState({
    duration: "All Time",
    typeName: "All",
    methodName: "All",
    transactionCategoryName: "All",
  });
  const [filteredData, setFilteredData] = useState([]);
  const [category, setCategory] = useState([]);
  const [modal, setModal] = useState(false);
  const [transType, setTransType] = useState("");
  const { param_id } = useParams();

  // ** Function to handle Modal toggle
  const handleModal = (data) => {
    setModal(!modal);
    setTransType(data);
  };

  const handleTransType = (data) => {
    setTransType(data);
  };

  const handleEdit = (row, data) => {
    setModal(!modal);
    setEditData({ edit: true, ...row });
    setTransType(data);
  };

  // ** Function to handle filter
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value.length) {
      const updatedData = pageTransData.Transactions.filter((item) => {
        const startsWith =
          item.description.toLowerCase().startsWith(value.toLowerCase()) ||
          item.page_no.toString().toLowerCase().startsWith(value.toLowerCase());

        const includes =
          item.description.toLowerCase().includes(value.toLowerCase()) ||
          item.page_no.toString().toLowerCase().includes(value.toLowerCase());

        if (startsWith) {
          return startsWith;
        } else if (!startsWith && includes) {
          return includes;
        } else return null;
      });

      setFilteredData(updatedData);
      setSearchValue(value);
    } else {
      setFilteredData(pageTransData.Transactions);
    }
  };

  // ** Filtering Data

  const filterData = (e) => {
    let dataFiltered = [];

    if (e.target.value.includes("All")) {
      dataFiltered = pageTransData.Transactions;
    } else if (e.target.name === "duration") {
      const date = new Date();

      if (e.target.value === "Today") {
        dataFiltered = pageTransData.Transactions.filter(
          (item) =>
            new Date(item.date).getDate() === date.getDate() &&
            new Date(item.date).getMonth() === date.getMonth()
        );
      } else if (e.target.value === "YesterDay") {
        dataFiltered = pageTransData.Transactions.filter(
          (item) =>
            new Date(item.date).getDate() === date.getDate() - 1 &&
            new Date(item.date).getMonth() === date.getMonth()
        );
      } else if (e.target.value === "This Month") {
        dataFiltered = pageTransData.Transactions.filter(
          (item) => new Date(item.date).getMonth() === date.getMonth()
        );
      } else if (e.target.value === "Last Month") {
        dataFiltered = pageTransData.Transactions.filter(
          (item) => new Date(item.date).getMonth() === date.getMonth() - 1
        );
      }
    } else {
      dataFiltered = pageTransData.Transactions.filter(
        (item) => item[e.target.name] === e.target.value
      );
    }

    setFilteredData(dataFiltered);
  };

  const handleFilter = (e) => {
    setFilterOpts((oldList) => {
      const newList = { ...oldList };
      newList[e.target.name] = e.target.value;
      return newList;
    });

    filterData(e);
  };

  const fetchData = async () => {
    transactionAddModalData(param_id)
      .then((res) => {
        if (res.status === 200) {
          setPageData(res.data);
        }
      })
      .catch((err) => err);

    getCategory()
      .then((res) => {
        if (res.status === 200) {
          setCategory(res.business_categories);
        }
      })
      .catch((err) => err);

    GetTransactionData(param_id)
      .then((res) => {
        if (res.status === 200) {
          setPageTransData(res.data);
          setFilteredData(res.data.Transactions);
        }
      })
      .catch((err) => err);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="row">
      <Col sm="12">
        <h2 className="content-header-title float-start mb-0">
          {pageData?.book?.name}
        </h2>
        <div className="breadcrumb-wrapper vs-breadcrumbs d-sm-block d-none col-12">
          <nav className="" aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"></li>
              <Link to={"../book/" + param_id + "/settings"}>
                <li
                  className="text-primary active breadcrumb-item"
                  aria-current="page"
                >
                  <Settings style={{ marginLeft: "20px" }} />
                </li>
              </Link>
            </ol>
          </nav>
        </div>
        <hr />
      </Col>

      <Col sm="12">
        <Card className="card-snippet card p-2">
          <div className="d-flex justify-content-start" style={{ gap: "16px" }}>
            <UncontrolledButtonDropdown>
              <DropdownToggle outline color="primary" caret>
                Duration: <span>{filterOpts.duration}</span>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  name="duration"
                  value="All Time"
                  onClick={(e) => handleFilter(e)}
                >
                  All Time
                </DropdownItem>
                <DropdownItem
                  name="duration"
                  value="Today"
                  onClick={(e) => handleFilter(e)}
                >
                  Today
                </DropdownItem>
                <DropdownItem
                  name="duration"
                  value="Yesterday"
                  onClick={(e) => handleFilter(e)}
                >
                  Yesterday
                </DropdownItem>
                <DropdownItem
                  name="duration"
                  value="This Month"
                  onClick={(e) => handleFilter(e)}
                >
                  This Month
                </DropdownItem>
                <DropdownItem
                  name="duration"
                  value="Last Month"
                  onClick={(e) => handleFilter(e)}
                >
                  Last Month
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledButtonDropdown>
            <UncontrolledButtonDropdown>
              <DropdownToggle outline color="primary" caret>
                Types: <span>{filterOpts.typeName}</span>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  name="typeName"
                  value="All"
                  onClick={(e) => handleFilter(e)}
                >
                  All
                </DropdownItem>
                <DropdownItem
                  name="typeName"
                  value="Cash In"
                  onClick={(e) => handleFilter(e)}
                >
                  Cash In
                </DropdownItem>
                <DropdownItem
                  name="typeName"
                  value="Cash Out"
                  onClick={(e) => handleFilter(e)}
                >
                  Cash Out
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledButtonDropdown>
            <UncontrolledButtonDropdown>
              <DropdownToggle outline color="primary" caret>
                Payment Methods: <span>{filterOpts.methodName}</span>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  name="methodName"
                  value="All"
                  onClick={(e) => handleFilter(e)}
                >
                  All
                </DropdownItem>
                <DropdownItem
                  name="methodName"
                  value="Cash"
                  onClick={(e) => handleFilter(e)}
                >
                  Cash
                </DropdownItem>
                <DropdownItem
                  name="methodName"
                  value="Online"
                  onClick={(e) => handleFilter(e)}
                >
                  Online
                </DropdownItem>
                <DropdownItem
                  name="methodName"
                  value="Cheque"
                  onClick={(e) => handleFilter(e)}
                >
                  Cheque
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledButtonDropdown>
            <UncontrolledButtonDropdown>
              <DropdownToggle outline color="primary" caret>
                Categories: <span>{filterOpts.transactionCategoryName}</span>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  key="0"
                  value="All"
                  name="transactionCategoryName"
                  onClick={(e) => handleFilter(e)}
                >
                  All
                </DropdownItem>
                {Object.keys(pageData).length !== 0
                  ? pageData?.transactionCategory.map((cat) => (
                      <DropdownItem
                        key={cat.id}
                        value={cat.name}
                        name="transactionCategoryName"
                        onClick={(e) => handleFilter(e)}
                      >
                        {cat.name}
                      </DropdownItem>
                    ))
                  : ""}
              </DropdownMenu>
            </UncontrolledButtonDropdown>
          </div>
          <Row className="justify-content-between align-items-center mx-0 my-2">
            <Col className="d-flex align-items-center" md="3" sm="12">
              <Label className="me-1" for="search-input">
                Search
              </Label>
              <Input
                className="dataTable-filter mb-50"
                type="text"
                bsSize="sm"
                id="search-input"
                value={searchValue}
                onChange={handleSearch}
                style={{ height: "38px", margin: "10px 0 0" }}
              />
            </Col>
            <Col className="" md="4">
              <Row className="g-1">
                {(pageTransData?.permission?.permissions_id == 1 ||
                  userdata.role_id != 3) && (
                  <Col md="6" onClick={() => handleModal("cashIn")}>
                    <Button.Ripple color="success" className="w-100">
                      <Plus size={16} /> Cash In
                    </Button.Ripple>
                  </Col>
                )}

                {(pageTransData?.permission?.permissions_id == 1 ||
                  userdata.role_id != 3) && (
                  <Col md="6" onClick={() => handleModal("cashOut")}>
                    <Button.Ripple color="danger" className="w-100">
                      <Minus size={16} /> Cash Out
                    </Button.Ripple>
                  </Col>
                )}
              </Row>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col sm="12">
        <div className="card-snippet card p-2 d-flex flex-row justify-content-between align-items-center">
          <div className="single-amount d-flex">
            <Button.Ripple
              className="btn-icon rounded-circle"
              color="success"
              style={{ width: "38px", height: "38px" }}
            >
              <Plus size={16} />
            </Button.Ripple>
            <div className="ms-1">
              <b>Cash In</b>
              <h4>{pageTransData.totalCashIn}</h4>
            </div>
          </div>
          <div className="single-amount d-flex">
            <Button.Ripple
              className="btn-icon rounded-circle"
              color="danger"
              style={{ width: "38px", height: "38px" }}
            >
              <Minus size={16} />
            </Button.Ripple>
            <div className="ms-1">
              <b>Cash Out</b>
              <h4>{pageTransData.totalCashOut}</h4>
            </div>
          </div>
          <div className="single-amount d-flex">
            <Button.Ripple
              className="btn-icon rounded-circle"
              color="primary"
              style={{ width: "38px", height: "38px" }}
            >
              <Menu size={16} />
            </Button.Ripple>
            <div className="ms-1">
              <b>Net Balance</b>
              <h4>{pageTransData.finalBalace}</h4>
            </div>
          </div>
        </div>
      </Col>
      <Row>
        <Col md="12">
          <Table
            handleModal={handleModal}
            handleEdit={handleEdit}
            pageTransData={pageTransData}
            filteredData={filteredData}
            fetchData={fetchData}
          />
        </Col>
      </Row>
      <AddNewModal
        open={modal}
        handleModal={handleModal}
        pageData={pageData}
        transType={transType}
        fetchData={fetchData}
        editData={editData}
      />
    </div>
  );
};

export default TransactionDetails;
