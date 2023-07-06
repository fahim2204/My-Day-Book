// ** Reactstrap Imports
import { Card, CardBody, CardText, Button } from "reactstrap";

// ** Images
import medal from "@src/assets/images/illustration/badge.svg";

const CardMedal = () => {
  return (
    <Card className="card-congratulations-medal">
      <CardBody>
        <h4>Welcome to My Day Book 🎉 </h4>
        <CardText className="font-small-3"></CardText>
        <h3 className="mb-75 mt-2 pt-50"></h3>
        <img className="congratulation-medal" src={medal} alt="Medal Pic" />
      </CardBody>
    </Card>
  );
};

export default CardMedal;
