// ** Custom Components
import Avatar from "@components/avatar";

// ** Icons Imports
import * as Icon from "react-feather";

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap";

const CardTransactions = () => {
  const transactionsArr = [
    {
      title: "Bkash",
      color: "light-primary",
      subtitle: "Starbucks",
      amount: "- 200",
      Icon: Icon["Pocket"],
      down: true,
    },
    {
      title: "Nogod",
      color: "light-success",
      subtitle: "Add Money",
      amount: "+ 5000",
      Icon: Icon["Check"],
    },
    {
      title: "Rocket",
      color: "light-danger",
      subtitle: "Add Money",
      amount: "+ 2000",
      Icon: Icon["DollarSign"],
    },
    {
      title: "Upay",
      color: "light-warning",
      subtitle: "Ordered Food",
      amount: "- 1500",
      Icon: Icon["CreditCard"],
      down: true,
    },
  ];

  const renderTransactions = () => {
    return transactionsArr.map((item) => {
      return (
        <div key={item.title} className="transaction-item">
          <div className="d-flex">
            <Avatar
              className="rounded"
              color={item.color}
              icon={<item.Icon size={18} />}
            />
            <div>
              <h6 className="transaction-title">{item.title}</h6>
              <small>{item.subtitle}</small>
            </div>
          </div>
          <div
            className={`fw-bolder ${
              item.down ? "text-danger" : "text-success"
            }`}
          >
            {item.amount}
          </div>
        </div>
      );
    });
  };

  return (
    <Card className="card-transaction">
      <CardHeader>
        <CardTitle tag="h4">Transactions</CardTitle>
        <Icon.MoreVertical size={18} className="cursor-pointer" />
      </CardHeader>
      <CardBody>{renderTransactions()}</CardBody>
    </Card>
  );
};

export default CardTransactions;
