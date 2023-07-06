// ** React Imports
import { Fragment, useState, useEffect } from "react";

// ** Third Party Components
import axios from "axios";

// ** Reactstrap Imports
import { Row, Col, TabContent, TabPane } from "reactstrap";

// ** Demo Components
import Tabs from "./Tabs";
import Breadcrumbs from "@components/breadcrumbs";
// import BillingTabContent from './BillingTabContent'
import AccountTabContent from "./MembersTabContent";
import SecurityTabContent from "./EntryFeildsTabContent";
// import ConnectionsTabContent from './ConnectionsTabContent'
// import NotificationsTabContent from './NotificationsTabContent'

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";

const AccountSettings = () => {
  // ** States
  const [activeTab, setActiveTab] = useState("1");
  const [data, setData] = useState(null);

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    axios
      .get("/account-setting/data")
      .then((response) => setData(response.data));
  }, []);

  return (
    <Fragment>
      <Breadcrumbs
        title="Business Settings"
        data={[{ title: "Pages" }, { title: "Business Settings" }]}
      />

      <Row>
        <Col xs={12}>
          <Tabs className="mb-2" activeTab={activeTab} toggleTab={toggleTab} />

          <TabContent activeTab={activeTab}>
            <TabPane tabId="2">
              <AccountTabContent data={data?.general} />
            </TabPane>
            <TabPane tabId="1">
              <SecurityTabContent />
            </TabPane>
            {/* <TabPane tabId='3'>
                <BillingTabContent />
              </TabPane>
              <TabPane tabId='4'>
                <NotificationsTabContent />
              </TabPane>
              <TabPane tabId='5'>
                <ConnectionsTabContent />
              </TabPane> */}
          </TabContent>
        </Col>
      </Row>
    </Fragment>
  );
};

export default AccountSettings;
