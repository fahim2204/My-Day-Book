// ** React Imports
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
// ** Core Layout Import
// !Do not remove the Layout import
import Layout from "@layouts/VerticalLayout";

// ** Menu Items Array
// import {Navigation} from "@src/navigation/vertical";
import { FileText, Home, Circle, Plus, Users, Book, Settings, Box } from "react-feather";
import { useSelector } from "react-redux";
import { Button } from "reactstrap";
import { AddButton } from "./AddBusiness";

const AddBusiness = () => {
  alert("hi");
};
const VerticalLayout = (props) => {
  const userdata = useSelector((state) => state.authentication.userData);

  const [menuData, setMenuData] = useState([]);

  const [pageData, setPageData] = useState(
    userdata.sidebar ? userdata.sidebar : []
  );

  const fetchMenu = () => {
    let DefaultArray = [];
    pageData.forEach((element, index) => {
      let newBusiness = {
        id: "bussiness-" + index,
        title: element.name,
        icon: <Book size={20} />,
        children: [
          {
            id: "bussiness-" + index + "-book1",
            title: "Cashbook",
            icon: <Box size={16} />,
            navLink: "/business/" + element.id,
          },
          {
            id: "bussiness-" + index + "-book2",
            title: "Bussiness Settings",
            icon: <Settings size={12} />,
            navLink: "/business/" + element.id + "/settings",
          },
        ],
      };
      setMenuData((oldList) => {
        let newList = oldList;
        newList.push(newBusiness);
        return newList;
      });

      //  DefaultArray.push(newBusiness);
    });

    // others menu

    // let othersmenu1 = {
    //   header: "All Report",
    // };

    // let othersmenu2 = {
    //   id: "report-all",
    //   title: "Reports",
    //   icon: <Home size={20} />,
    //   children: [
    //     {
    //       id: "repport-1",
    //       title: "Business Wise",
    //       icon: <Circle size={12} />,
    //       navLink: "/business/",
    //     },
    //     {
    //       id: "repport-2",
    //       title: "Company Wise",
    //       icon: <Circle size={12} />,
    //       navLink: "/business/",
    //     },
    //   ],
    // };

    // Notes menu
    let othersmenu3 = {
      header: "All Notes",
    };

    let othersmenu4 = {
      id: "note-add",
      title: <>Add Note</>,
      icon: <Plus size={20} />,
      navLink: "/note/add",
    };

    let othersmenu5 = {
      id: "all-notes",
      title: "View Notes",
      icon: <FileText size={12} />,
      navLink: "/notes/",
    };

    let othersmenu6 = {
      header: "All Users",
    };

    let othersmenu7 = {
      id: "all-users",
      title: "Users",
      icon: <Users size={12} />,
      navLink: "/users",
    };

    setMenuData((oldList) => {
      let newList = oldList;
      // newList.push(othersmenu1);
      // newList.push(othersmenu2);
      newList.push(othersmenu3);
      newList.push(othersmenu4);
      newList.push(othersmenu5);
      if (userdata.role_id != 3) {
        newList.push(othersmenu6);
        newList.push(othersmenu7);
      }

      return newList;
    });
  };

  // ** For ServerSide navigation
  useEffect(() => {
    if (userdata.role_id != 3) {
      setMenuData([
        {
          id: "home",
          title: "Dashboard",
          icon: <Home size={20} />,
          navLink: "/dashboard",
        },
        {
          id: "bussiness-add",
          title: <>Add Business</>,
          icon: <Plus size={20} />,
          navLink: "/business/create",
        },
        {
          header: "All Bussiness",
        },
      ]);
    } else {
      setMenuData([
        {
          id: "home",
          title: "Dashboard",
          icon: <Home size={20} />,
          navLink: "/dashboard",
        },
        {
          header: "All Bussiness",
        },
      ]);
    }

    fetchMenu();
  }, []);

  return (
    <Layout menuData={menuData} {...props}>
      <Outlet />
    </Layout>
  );
};

export default VerticalLayout;
