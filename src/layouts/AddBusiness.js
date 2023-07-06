import { Button } from "reactstrap";
import { Plus } from "react-feather";
export const AddButton = () => {
  return (
    <>
      <Button className="ms-2" color="primary" onClick={() => quickAdd("")}>
        <Plus size={15} />
        <span className="align-middle ms-50">Add New Book</span>
      </Button>
    </>
  );
};
