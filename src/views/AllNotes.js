import { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";

// ** Icons Imports
import { Plus, Minus, Menu } from "react-feather";
import EditNoteModal from "@components/modals/EditNoteModal";
import { getNotes } from "@apifile";

// ** Table
import Table from "@components/tables/NotesTable";

const AllNotes = () => {
  // ** States
  const [pageNotes, setPageNotes] = useState([]);
  const [editNote, setEditNote] = useState({});
  const [modal, setModal] = useState(false);

  // ** Function to handle Modal toggle
  const handleModal = () => {
    setModal(!modal);
  };

  const handleEdit = (row) => {
    setModal(!modal);
    setEditNote({ edit: true, ...row });
  };

  const fetchData = async () => {
    getNotes()
      .then((res) => {
        if (res.status === 200) {
          setPageNotes(res.data);
        }
      })
      .catch((err) => err);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Row>
        <Col md="12">
          <Table
            filteredData={pageNotes}
            fetchData={fetchData}
            handleEdit={handleEdit}
          />
        </Col>
      </Row>
      <EditNoteModal
        open={modal}
        handleModal={handleModal}
        fetchData={fetchData}
        editNote={editNote}
      />
    </div>
  );
};

export default AllNotes;
