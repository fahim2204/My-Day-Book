import React, { useEffect, useState, useRef } from "react";

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
import { renderToString } from "react-dom/server";
import Select from "react-select";
import { selectThemeColors } from "@utils";

// ** Icons Imports
import {
  Plus,
  Minus,
  Menu,
  Settings,
  DownloadCloud,
  UploadCloud,
} from "react-feather";
import AddNewModal from "@components/modals/TransactionDetailsAddModal"
import DetailsModal from "@components/modals/TransactionDetailsModal"
import CustomDateModal from "@components/modals/CustomDateModal"
import { transactionAddModalData, GetTransactionData } from "@apifile"
import { handleFilterData } from "../redux/filterData"

// ** Table
import Table from "@components/tables/books/TransitionDetailsTable"
import { useSelector, useDispatch } from "react-redux"
// import globalThis from 'globalthis';
// globalThis.window = globalThis;
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import html2canvas from "html2canvas"
import logo from "@src/assets/images/logo/logo.png"

const doc = new jsPDF()
const ref = React.createRef()

const TestBal = ({
  handleModal,
  handleEdit,
  pageTransData,
  filteredData,
  fetchData,
}) => {
  return (
    <>
      <h4>Hey Bal</h4>
      <table>
        <tr>
          <td>
            <h4 style={{ fontSize: "12px" }}>Total Cash In</h4>
            <h5>5000</h5>
          </td>
          <td>
            <h4>Total Cash Out</h4>
            <h5>2500</h5>
          </td>
          <td>
            <h4>Final Balance</h4>
            <h5>2500</h5>
          </td>
        </tr>
      </table>
    </>
  )
}
const TransactionDetails = () => {
  // ** States
  const userdata = useSelector((state) => state.authentication.userData)
  const filteredData = useSelector((state) => state.filterData.data)
  const dispatch = useDispatch()

  const [searchValue, setSearchValue] = useState("")
  const [pageData, setPageData] = useState([])
  const [searDate, setSearDate] = useState({start:'',end:''})
  const [editData, setEditData] = useState({})
  const [pdfShow, setPdfShow] = useState(false)
  const [pageTransData, setPageTransData] = useState([])
  const [selectedOptions, setSelectedOptions] = React.useState([]);
  const [filterOpts, setFilterOpts] = useState({
    duration: "All Time",
    typeName: "All",
    methodName: "All",
    contactName: "",
    transactionCategoryName: "All"
  })

  const [contacts, setContacts] = useState([{ value: "All", label: "All" }])
  const [contactsForModal, setContactsForModal] = useState([])
  const [modal, setModal] = useState(false)
  const [detailsModal, setDetailsModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [transType, setTransType] = useState("")
  const { param_id } = useParams()

  const certificateTemplateRef = useRef(null)

  // ** Function to handle Modal toggle
  const handleModal = (data) => {
    setModal(!modal)
    setTransType(data)
  }

  const handleDetailsModal = (row,data) => {
    setDetailsModal(!detailsModal)
    setEditData({ edit: true, ...row })
    setTransType(data);
  }

  const handleTransType = (data) => {
    setTransType(data)
  }

  const handleEdit = (row, data) => {
    setModal(!modal);
    setEditData({ edit: true, ...row })
    setTransType(data);
  }

  // ** Function to handle filter
  const handleSearch = (e) => {
    const value = e.target.value
    setSearchValue(value)
    if (value.length) {
      const updatedData = pageTransData?.Transactions?.filter((item) => {
        const startsWith =
          item?.description?.toLowerCase().startsWith(value.toLowerCase()) ||
          // item?.contactName?.toLowerCase().startsWith(value.toLowerCase()) ||
          item?.page_no
            ?.toString()
            .toLowerCase()
            .startsWith(value.toLowerCase());
        const includes =
          item?.description?.toLowerCase().includes(value.toLowerCase()) ||
          // item?.contactName?.toLowerCase().includes(value.toLowerCase()) ||
          item?.page_no?.toString().toLowerCase().includes(value.toLowerCase())
        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      });
      setSearchValue(value)
      dispatch(handleFilterData(updatedData))
    } else {
    }
  }

  // ** Filtering Data
  const filterData = (e) => {
    let dataFiltered = []
    let contactNames = [];
    if (e.target.name === "contactName") {
      
      e.target.value.forEach((item,index)=>{
        contactNames.push(item.value)
        
      })

      if (contactNames.includes("All")) {
        dataFiltered = pageTransData.Transactions
      }else{
        
          pageTransData?.Transactions.forEach((item,index)=>{
            contactNames.forEach((item1,index1)=>{
              if(item1 == item.contactName){
                console.log("mile")
                dataFiltered.push(item)
              }
            })
        })

        if(contactNames.length == 0){
          dataFiltered = pageTransData.Transactions
        }
      }

      
      console.log("names",dataFiltered)
      
    }else if (e.target.value.includes("All")) {
      dataFiltered = pageTransData.Transactions
    } else if (e.target.name === "duration") {
      const date = new Date()

      if (e.target.value === "Today") {
        dataFiltered = pageTransData.Transactions.filter(
          (item) =>
            new Date(item.date).getDate() === date.getDate() &&
            new Date(item.date).getMonth() === date.getMonth()
        )
      } else if (e.target.value === "Yesterday") {
        dataFiltered = pageTransData.Transactions.filter(
          (item) =>
            new Date(item.date).getDate() === date.getDate() - 1 &&
            new Date(item.date).getMonth() === date.getMonth()
        )
      } else if (e.target.value === "This Month") {
        dataFiltered = pageTransData.Transactions.filter(
          (item) => new Date(item.date).getMonth() === date.getMonth()
        )
      } else if (e.target.value === "Last Month") {
        dataFiltered = pageTransData.Transactions.filter(
          (item) => new Date(item.date).getMonth() === date.getMonth() - 1
        )
      }
    } else {
      dataFiltered = pageTransData?.Transactions?.filter(
        (item) => item[e.target.name] === e.target.value
      )
      
      
    }

    console.log("filter",pageTransData)
    let cashInVal = 0;
    let cashOutVal = 0;
    let netVal = 0;
    dataFiltered.forEach((item,index)=>{
      if(item.type === "cashIn"){
        cashInVal += item.amount
      }else if(item.type === "cashOut"){
        cashOutVal += item.amount
      }
    })

    netVal = (cashInVal) -  (cashOutVal)
    console.log("final filter",cashInVal)
    setPageTransData((oldList) => {
      const newList = { ...oldList }
      newList.totalCashIn = cashInVal
      newList.totalCashOut = cashOutVal
      newList.finalBalace = netVal
      return newList
    })

    dispatch(handleFilterData(dataFiltered));
  }

  const handleFilter = (e) => {
    setFilterOpts((oldList) => {
      const newList = { ...oldList }
      newList[e.target.name] = e.target.value
      return newList
    })

    filterData(e)
  }

  // ** Select2 Handle
  const handleSelectChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
    console.log("multi",selectedOptions)
    filterData({
      target: {
        name: "contactName",
        value: selectedOptions
      }
    })
  };

  const getContactNames = () => {
    let names =[];
    selectedOptions.forEach((item) => {
      names.push(item.value)
    })

    if(names.includes("All")){
      return "All"
    }else{
      return names.join(",");
    }
  }

  const handleFilterSearch = (e)=>{

  }

  const fetchData = async () => {
    transactionAddModalData(param_id)
      .then((res) => {
        if (res.status === 200) {
          setPageData(res.data)
          setContacts((oldList) => {
            
            let newList1 = [{ value: "All", label: "All" },...res.data.bookContact.map((item) => {
                return {
                  value: item.name,
                  label: item.name,
                };
              })
            ]
              
            
            let newList = { ...oldList };
            newList=newList1
            return newList;
          });
          setContactsForModal((oldList) => {
            
            let newList1 = [...res.data.bookContact.map((item) => {
                return {
                  value: item.id,
                  label: item.name,
                };
              })
            ]
              
            
            let newList = { ...oldList };
            newList=newList1
            return newList;
          });
        }
      })
      .catch((err) => err)
    // getCategory()
    //   .then((res) => {
    //     if (res.status === 200) {
    //         setCategory(res.business_categories)
    //     }
    // }).catch((err) => err)
    GetTransactionData(param_id)
      .then((res) => {
        if (res.status === 200) {
          setPageTransData(res.data)
          dispatch(handleFilterData(res.data.Transactions))
        }
      })
      .catch((err) => err)
  };
  // ** Converts table to CSV
  function convertArrayOfObjectsToCSV(array) {
    let result;

    const columnDelimiter = ","
    const lineDelimiter = "\n"
    const keys = Object.keys(filteredData[0])

    result = "";
    result += keys.join(columnDelimiter)
    result += lineDelimiter

    array.forEach((item) => {
      let ctr = 0;
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter

        result += item[key]

        ctr++
      });
      result += lineDelimiter
    })

    return result
  }

  function convertArrayOfObjectsToPDF(array) {
    let result;

    const columnDelimiter = ","
    const lineDelimiter = "\n"
    const keys = Object.keys(filteredData[0])

    result = []
    array.forEach((item, index) => {
      if(index == 0 ){
        setSearDate((oldList) => {
          let newList = { ...oldList };
          newList.start = item.date
          return newList;
        });
      }

      if(array.length-1 == index ){
        setSearDate((oldList) => {
          let newList = { ...oldList };
          newList.end = item.date
          return newList;
        });
      }
      let cashIn = 0;
      let cashOut = 0;
      if(item.type== "cashIn"){
        cashIn = item.amount;
      }else if(item.type== "cashOut"){
        cashOut = item.amount;
      }
      let rowarray = [
        item.date,
        item.description,
        item.transactionCategoryName,
        item.methodName,
        item.page_no,
        cashIn,
        cashOut,
        item.balance
      ]

      result.push(rowarray)
      console.log("sdfsdf", result)
    })
    return result
  }

  // ** Downloads CSV
  function downloadCSV(array) {
    const link = document.createElement("a")
    let csv = convertArrayOfObjectsToCSV(array)
    console.log("eads", csv)
    if (csv === null) return

    const filename = "export.csv"

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`
    }

    link.setAttribute("href", encodeURI(csv))
    link.setAttribute("download", filename)
    link.click()
  }

  async function downloadPDF(array) {

    setPdfShow(true)
    let bodyData = convertArrayOfObjectsToPDF(array)
    let header = [
      "Date",
      "Details",
      "Category",
      "Mode",
      "Page No",
      "Cash In",
      "Cash Out",
      "Balance"
    ]
    let body = []
    filteredData.forEach((element, index) => {
      if (index == 0) {
        body = body
      }
    })

    // const input = document.getElementById("fromHTMLtestdiv").innerHTML;
    const string = renderToString(
      <TestBal
        {...{ handleModal, handleEdit, pageTransData, filteredData, fetchData }}
      />
    )


    window.setTimeout(() => {
      let devWidth = document.getElementById("fromHTMLtestdiv").offsetWidth
      let devwidthVal = (devWidth > 1400) ? 1150 : 840
      html2canvas(certificateTemplateRef.current, {
        scale: devwidthVal / document.getElementById("fromHTMLtestdiv").offsetWidth
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png")
        const pdf = new jsPDF()
        pdf.addImage(imgData, "PNG", 10, 10)
        // ------
        

        // pdf.text(13, 15, pageData?.book?.name);
        pdf.autoTable(header, bodyData, {
          startY: 90,
          showHead: "everyPage",
          didDrawPage: function (data) {
            // Header
            pdf.setFontSize(20);
            pdf.setTextColor(40);

            // Footer
            var str = "Page " + pdf.internal.getNumberOfPages();

            pdf.setFontSize(10);

            // jsPDF 1.4+ uses getWidth, <1.4 uses .width
            var pageSize = pdf.internal.pageSize;
            var pageHeight = pageSize.height
              ? pageSize.height
              : pageSize.getHeight();
            pdf.text(str, data.settings.margin.left, pageHeight - 10);
          }
        })
        pdf.save("download.pdf")
      })

      setPdfShow(false)
    }, 1000)
  }

  const dateFromat = () =>{
    // Get the current date
const currentDate = new Date();

// Define the month names
const monthNames = [
  "January", "February", "March",
  "April", "May", "June",
  "July", "August", "September",
  "October", "November", "December"
];

// Format the date string
const formattedDate = currentDate.getDate() + ' ' + monthNames[currentDate.getMonth()] + ', ' + currentDate.getFullYear();
return formattedDate;
  }

  useEffect(() => {
    fetchData()
  }, [])

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

              {(pageTransData?.permission?.permissions_id === 1 ||
                  userdata.role_id !== 3) && (
                  <>
                  <Link to={"../book/" + param_id + "/settings"}>
                <li
                  className="text-primary active breadcrumb-item"
                  aria-current="page"
                >
                  <Settings style={{ marginLeft: "20px" }} />
                </li>
              </Link>
              <li className="text-primary  breadcrumb-item" aria-current="page">
                {/* <Link to={"../book/" + param_id + "/settings"}>
                  <UploadCloud
                    style={{ marginLeft: "18px", marginRight: "5px" }}
                  />
                  Bulk entry
                </Link> */}   
              </li>
              <li className="text-primary  breadcrumb-item" aria-current="page">
                <UncontrolledButtonDropdown>
                  <DropdownToggle outline color="primary" caret>
                    <DownloadCloud style={{ marginLeft: "20px" }} size={16} />{" "}
                    Report: <span>Excel</span>
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem
                      name="duration"
                      value="All Time"
                      onClick={() => downloadPDF(filteredData)}
                    >
                      PDF Report
                    </DropdownItem>
                    <DropdownItem
                      name="duration"
                      value="Today"
                      onClick={() => downloadCSV(filteredData)}
                    >
                      Excel Report
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
              </li>
                  </>
                )}
              

              

              
            </ol>
          </nav>
        </div>
        <hr />
      </Col>

      <Col sm="12">
        <Card className="card-snippet card p-2">
          <div className="d-flex justify-content-start" style={{ gap: "16px", flexWrap: "wrap" }}>
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
                <DropdownItem
                  name="duration"
                  value="custom"
                  onClick={() => setEditModal(!editModal)}
                >
                  Custom
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

              {/* <DropdownItem
                  name="methodName"
                  value="All"
                  onClick={(e) => handleFilter(e)}
                >
                 <Input type='text' id='basic-cb-unchecked3' onChange={(e)=>handleFilterSearch(e)} /> 
                </DropdownItem> */}

                <DropdownItem
                  name="methodName"
                  value="All"
                  onClick={(e) => handleFilter(e)}
                >
                 <Input type='checkbox' id='basic-cb-unchecked3' defaultChecked={filterOpts.methodName == "All" && true} /> All
                </DropdownItem>
                <DropdownItem
                  name="methodName"
                  value="Cash"
                  onClick={(e) => handleFilter(e)}
                >
                 <Input type='checkbox' id='basic-cb-unchecked3' defaultChecked={filterOpts.methodName == "Cash" && true} /> Cash
                </DropdownItem>
                <DropdownItem
                  name="methodName"
                  value="Online"
                  onClick={(e) => handleFilter(e)}
                >
                 <Input type='checkbox' id='basic-cb-unchecked3' defaultChecked={filterOpts.methodName == "Online" && true} /> Online
                </DropdownItem>
                <DropdownItem
                  name="methodName"
                  value="Cheque"
                  onClick={(e) => handleFilter(e)}
                >
                 <Input type='checkbox' id='basic-cb-unchecked3' defaultChecked={filterOpts.methodName == "Cheque" && true} /> Cheque
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledButtonDropdown>
            <Select
              theme={selectThemeColors}
              isMulti
              className="contact-select react-select"
              classNamePrefix="select"
              options={contacts}
              isClearable={true}
              placeholder="Contact Name: All"
              value={selectedOptions}
              onChange={handleSelectChange}
            />
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
                 <Input type='checkbox' id='basic-cb-unchecked3' defaultChecked={filterOpts.transactionCategoryName == "All" && true} /> All
                </DropdownItem>
                {Object.keys(pageData).length !== 0
                  ? pageData?.transactionCategory.map((cat) => (
                      <DropdownItem
                        key={cat.id}
                        value={cat.name}
                        name="transactionCategoryName"
                        onClick={(e) => handleFilter(e)}
                      >
                       <Input type='checkbox' id='basic-cb-unchecked3' defaultChecked={filterOpts.transactionCategoryName == cat.name && true} /> {cat.name}
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
                {(pageTransData?.permission?.permissions_id === 1 ||
                  userdata.role_id !== 3) && (
                  <Col md="6" onClick={() => handleModal("cashIn")}>
                    <Button.Ripple color="success" className="w-100">
                      <Plus size={16} /> Cash In
                    </Button.Ripple>
                  </Col>
                )}

                {(pageTransData?.permission?.permissions_id === 1 ||
                  userdata.role_id !== 3) && (
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
      {pdfShow === true && <>
        <div
        ref={certificateTemplateRef}
        style={{ height: "100%", overflow: "auto",  }}
        id="fromHTMLtestdiv"
      >
        <div className="Pdf-part0">
          <div className="Pdf-part0-wrap d-flex flex-row" >
            <div className="pdflogo">
            <img
              className=""
              src={logo}
              alt="avatarImg"
              height={72}
              width={72}
            />
            </div>
            <div className="pdftitle">
                    <div className="pdftitle-1">May Day Book</div>
                    <div className="pdftitle-2">Generated On - {dateFromat()}, Generated by - {userdata.name} (+88{userdata.phone})</div>
            </div>

          </div>
        </div>
        <div className="Pdf-part1">
          <div className="BookTitle" style={{fontWeight:"bold"}}>{pageData?.book?.name}</div>
        </div>
        <div className="Pdf-part2">
          <div><span style={{fontWeight:"bold"}}>Duration:</span> {searDate?.start == searDate?.end ?searDate?.start:`${searDate?.start} To ${searDate?.end}`  }</div>
          <div>
          <span style={{fontWeight:"bold"}}>Contacts:</span> {selectedOptions ? getContactNames(): 'All'}
          </div>
        </div>

        <div className="Pdf-part3 d-flex flex-row ">
          <div className="part3-single">
            <div style={{fontWeight:"bold"}}>Total Cash IN</div>
            <div className="part3-single-cashIn">{pageTransData.totalCashIn}</div>
          </div>
          <div className="part3-single">
            <div style={{fontWeight:"bold"}}>Total Cash Out</div>
            <div  className="part3-single-cashOut">{pageTransData.totalCashOut}</div>
          </div>
          <div className="part3-single">
            <div style={{fontWeight:"bold"}}>Net Balance</div>
            <div  className="part3-single-balance">{pageTransData.finalBalace}</div>
          </div>
        </div>
        </div>
      
      </>}
      
        <div>
          <Col sm="12">
            <div
              className="card-snippet card p-2 d-flex flex-row justify-content-between align-items-center"
              style={{ height: "100%", width: "100%", overflow: "auto" }}
            >
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
        </div>
        <Col md="12" id="my-table">
            <div>
              <Table
              
                handleModal={handleModal}
                handleEdit={handleEdit}
                pageTransData={pageTransData}
                filteredData={filteredData}
                fetchData={fetchData}
                handleDetailsModal={handleDetailsModal}
                id="my-table"
              />
            </div>
        </Col>
      
      <AddNewModal
        open={modal}
        handleModal={handleModal}
        pageData={pageData}
        transType={transType}
        fetchData={fetchData}
        editData={editData}
        contactsForModal={contactsForModal}
        
      />
      <DetailsModal open={detailsModal}
        handleModal={handleDetailsModal}
        pageData={pageData}
        transType={transType}
        fetchData={fetchData}
        editData={editData}
      />
      <CustomDateModal
        formModal={editModal}
        setFormModal={setEditModal}
        filteredData={pageTransData.Transactions}
      />
    </div>
  )
}
export default TransactionDetails
