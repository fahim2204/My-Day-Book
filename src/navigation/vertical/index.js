import { useEffect, useState } from "react";
import { Mail, Home, Circle } from "react-feather";
import { useSelector } from "react-redux";

export default Navigation = () => {
  const userdata = useSelector((state) => state.authentication.userData);
  const [pageData, setPageData] = useState(userdata.sidebar);
  let defaultArray = [
    {
      id: "home",
      title: "Dashboard",
      icon: <Home size={20} />,
      navLink: "/dashboard",
    },
    {
      header: "All Bussiness",
    },
  ];
  pageData.forEach((element, index) => {
    let newBusiness = {
      id: "bussiness-" + index,
      title: element.name,
      icon: <Home size={20} />,
      children: [
        {
          id: "bussiness-" + index + "-book1",
          title: "Cashbook",
          icon: <Circle size={12} />,
          navLink: "/bussiness/books",
        },
        {
          id: "bussiness-" + index + "-book2",
          title: "Bussiness Settings",
          icon: <Circle size={12} />,
          navLink: "/bussiness/books1",
        },
      ],
    };

    defaultArray.push(newBusiness);
  });

  console.log("yyy", defaultArray);

  return defaultArray;
};
// export default Navigation();

// [
//   {
//     id: "home",
//     title: "Dashboard",
//     icon: <Home size={20} />,
//     navLink: "/home",
//   },
//   {
//     header: 'All Bussiness'
//   },
//   {
//     id: "bussiness1",
//     title: "Amar Bussiness",
//     icon: <Mail size={20} />,
//     children: [
//           {
//             id: 'book1',
//             title: 'Cashbook',
//             icon: <Circle size={12} />,
//             navLink: '/bussiness/books'
//           },
//           {
//             id: 'book2',
//             title: 'Bussiness Settings',
//             icon: <Circle size={12} />,
//             navLink: '/bussiness/books1'
//           }

//         ]

//   },
//   {
//     id: "bussiness2",
//     title: "Shopno",
//     icon: <Mail size={20} />,
//     navLink: "/second-page1",
//     children: [
//       {
//         id: 'book3',
//         title: 'Cashbook',
//         icon: <Circle size={12} />,
//         navLink: '/bussiness/book5'
//       },
//       {
//         id: 'book4',
//         title: 'Bussiness Settings',
//         icon: <Circle size={12} />,
//         navLink: '/bussiness/books4'
//       }

//     ]
//   },
//   {
//     id: "bussiness3",
//     title: "Agora",
//     icon: <Mail size={20} />,
//     navLink: "/second-page2",
//     children: [
//       {
//         id: 'book5',
//         title: 'Cashbook',
//         icon: <Circle size={12} />,
//         navLink: '/bussiness/books2'
//       },
//       {
//         id: 'book6',
//         title: 'Bussiness Settings',
//         icon: <Circle size={12} />,
//         navLink: '/bussiness/books3'
//       }

//     ]
//   }
// ];
