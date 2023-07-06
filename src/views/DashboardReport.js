import { useEffect, useState, useContext } from "react";
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
import { useParams } from "react-router-dom";

// ** Icons Imports
import { Plus, Minus, Menu } from "react-feather";
import AddNewModal from "@components/modals/TransactionDetailsAddModal";
import {
  transactionAddModalData,
  getCategory,
  GetDashboardTransactionData,
} from "@apifile";

// ** Table
import Table from "@components/tables/books/TransitionDetailsTable";

// ** Context
import { ThemeColors } from "@src/utility/context/ThemeColors";
// ** Demo Components
// import CompanyTable from './CompanyTable'
import Earnings from "@src/views/ui-elements/cards/analytics/Earnings";
import CardMedal from "@src/views/ui-elements/cards/advance/CardMedal";
import CardMeetup from "@src/views/ui-elements/cards/advance/CardMeetup";
import StatsCard from "@src/views/ui-elements/cards/statistics/StatsCard";
import GoalOverview from "@src/views/ui-elements/cards/analytics/GoalOverview";
import RevenueReport from "@src/views/ui-elements/cards/analytics/RevenueReport";
import OrdersBarChart from "@src/views/ui-elements/cards/statistics/OrdersBarChart";
import CardTransactions from "@src/views/ui-elements/cards/advance/CardTransactions";
import ProfitLineChart from "@src/views/ui-elements/cards/statistics/ProfitLineChart";
import CardBrowserStates from "@src/views/ui-elements/cards/advance/CardBrowserState";
// ** Styles
import "@styles/react/libs/charts/apex-charts.scss";
import "@styles/base/pages/dashboard-ecommerce.scss";

const DashboardReport = () => {
  // ** States
  const [searchValue, setSearchValue] = useState("");
  const [pageData, setPageData] = useState([]);
  const [pageTransData, setPageTransData] = useState([]);
  const [transactionChart, setTransactionChart] = useState([]);
  const [filterOpts, setFilterOpts] = useState({
    duration: "All Time",
    typeName: "All",
    business: "All",
    book: "All",
    methodName: "All",
    transactionCategoryName: "All",
  });
  const [filteredData, setFilteredData] = useState([]);
  const [searchData, setSearchData] = useState({ businessId: 0, bookId: 0 });
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

  // ** Filtering Data

  const filterData = (e) => {
    let dataFiltered = [];

    if (e.target.name === "duration") {
      const date = new Date();

      if (e.target.value === "Today") {
        dataFiltered = pageTransData.Transactions.filter(
          (item) => new Date(item.created_at).getDate() === date.getDate()
        );
      } else if (e.target.value === "YesterDay") {
        dataFiltered = pageTransData.Transactions.filter(
          (item) => new Date(item.created_at).getDate() === date.getDate() - 1
        );
      } else if (e.target.value === "This Month") {
        dataFiltered = pageTransData.Transactions.filter(
          (item) => new Date(item.created_at).getMonth() === date.getMonth()
        );
      } else if (e.target.value === "Last Month") {
        dataFiltered = pageTransData.Transactions.filter(
          (item) => new Date(item.created_at).getMonth() === date.getMonth() - 1
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

  const handleDataFilter = (e, fieldName) => {
    if (fieldName.type == "business") {
      fetchData(fieldName.value, searchData.bookId);
    } else if (fieldName.type == "book") {
      fetchData(searchData.businessId, fieldName.value);
    }

    const sBook = pageTransData?.bookList?.find(item => item.id === parseInt(fieldName.value))
    
    setFilterOpts(oldList => {
      const newList = {...oldList}
      newList[fieldName.type] = sBook?.['name'] || "All"
      return newList
    })
  };

  const fetchData = async (businessId, BookId) => {
    transactionAddModalData(businessId)
      .then((res) => {
        if (res.status === 200) {
          setPageData(res.data);
        }
      })
      .catch((err) => err);

    GetDashboardTransactionData(businessId, BookId)
      .then((res) => {
        if (res.status === 200) {
          setPageTransData(res.data);
          setFilteredData(res.data.Transactions);
          let cashoutPercentage =
            (res.data.totalCashOut * 100) / res.data.totalCashIn;
          let balancePercentage =
            (res.data.finalBalace * 100) / res.data.totalCashIn;
          setTransactionChart([cashoutPercentage, balancePercentage]);
        }
      })
      .catch((err) => err);
  };

  useEffect(() => {
    fetchData(searchData.businessId, searchData.bookId);
  }, []);

  const { colors } = useContext(ThemeColors);

  // ** vars
  const trackBgColor = "#e9ecef";
  return (
    <div>
      <div id="dashboard-ecommerce">
        <Row className="match-height">
          <Col xl="4" md="6" xs="12">
            <CardMedal />
          </Col>
          <Col xl="8" md="6" xs="12">
            <StatsCard cols={{ xl: "3", sm: "6" }} {...{ pageTransData }} />
          </Col>
        </Row>
        <Row className="match-height">
          <Col lg="4" md="12">
            <Earnings success={colors.success.main} {...{ transactionChart }} />
          </Col>
          <Col lg="8" md="12">
            {/* <CardTransactions /> */}
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
        </Row>
      </div>
      <Col sm="12">
        <Card className="card-snippet card p-2">
          <div className="d-flex justify-content-start" style={{ gap: "16px" }}>
            {/* <UncontrolledButtonDropdown>
              <DropdownToggle outline color="primary" caret>
                All Business: <span>{filterOpts.business}</span>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  name="typeName"
                  value="All"
                  onClick={(e) =>
                    handleDataFilter(e, {
                      type: "business",
                      value: e.target.value,
                    })
                  }
                >
                  All
                </DropdownItem>
                {Object.keys(pageTransData).length !== 0
                  ? pageTransData?.businessList.map((cat) => (
                      <DropdownItem
                        key={cat.id}
                        value={cat.id}
                        name="transactionCategoryName"
                        onClick={(e) =>
                          handleDataFilter(e, {
                            type: "business",
                            value: e.target.value,
                          })
                        }
                      >
                        {cat.name}
                      </DropdownItem>
                    ))
                  : ""}
              </DropdownMenu>
            </UncontrolledButtonDropdown> */}
            <UncontrolledButtonDropdown>
              <DropdownToggle outline color="primary" caret>
                All Books: <span>{filterOpts.book}</span>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  name="typeName"
                  value="All"
                  onClick={(e) =>
                    handleDataFilter(e, { type: "book", value: e.target.value })
                  }
                >
                 <Input type='checkbox' id='basic-cb-unchecked3' defaultChecked={filterOpts.book == "All" && true} /> All
                </DropdownItem>
                {Object.keys(pageTransData).length !== 0
                  ? pageTransData?.bookList.map((cat) => (
                      <DropdownItem
                        key={cat.id}
                        value={cat.id}
                        name="transactionCategoryName"
                        onClick={(e) =>
                          handleDataFilter(e, {
                            type: "book",
                            value: e.target.value,
                          })
                        }
                      >
                       <Input type='checkbox' id='basic-cb-unchecked3' defaultChecked={filterOpts.book == cat.name && true} /> {cat.name}
                      </DropdownItem>
                    ))
                  : ""}
              </DropdownMenu>
            </UncontrolledButtonDropdown>
            {/* <UncontrolledButtonDropdown>
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
                  value="Lat Month"
                  onClick={(e) => handleFilter(e)}
                >
                  Last Month
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledButtonDropdown> */}
            {/* <UncontrolledButtonDropdown>
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
            </UncontrolledButtonDropdown> */}
            {/* <UncontrolledButtonDropdown>
              <DropdownToggle outline color="primary" caret>
                Payment Methods: <span>{filterOpts.methodName}</span>
              </DropdownToggle>
              <DropdownMenu>
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
            </UncontrolledButtonDropdown> */}
            {/* <UncontrolledButtonDropdown>
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
            </UncontrolledButtonDropdown>*/}
          </div>
        </Card>
      </Col>

      <Row>
        <Col md="12">
          <Table
            handleModal={handleModal}
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
      />
    </div>
  );
};

export default DashboardReport;
