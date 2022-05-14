import camelToCapitalize from "../../../../utils/input/camelToCapitalize";
import { Modal, Button, Form } from "react-bootstrap";
import { InputFormModalRow, SelectFormModalRow } from ".";
import { objectAny, objectSetAll } from "../../../../utils/object";

const LogAdminDataFormModal = (props) => {
  return (
    <>
      <Modal
        scrollable={true}
        show={props.show}
        onHide={props.onHide}
        centered
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        animation={false}
        style={{
          opacity: 1,
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Log Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {Object.keys(props.data)
              .filter((key) => props.modalConfig[key].display)
              .map((field) => {
                return (
                  <>
                    {props.modalConfig[field].type === "select" ? (
                      <SelectFormModalRow
                        key={`${field}`}
                        field={field}
                        options={props.modalConfig[field].selectOptions}
                        chosenOption={props.data[field]}
                        onChangeValue={() => {}}
                      />
                    ) : (
                      <InputFormModalRow
                        key={`${field}`}
                        field={field}
                        type={props.modalConfig[field].type}
                        mutable={props.modalConfig[field].mutable}
                        placeholder={camelToCapitalize(field)}
                        blank={props.modalConfig[field].blank}
                        value={props.data[field]}
                        onChangeValue={() => {}}
                      />
                    )}
                    <div className="mb-2" />
                  </>
                );
              })}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const logModalOptions = {
  _id: {
    mutable: false,
    blank: false,
    type: "text",
    display: false,
  },
  api: {
    mutable: false,
    blank: false,
    type: "text",
    display: true,
  },
  method: {
    mutable: false,
    blank: false,
    type: "text",
    display: true,
  },
  userAgent: {
    mutable: false,
    blank: false,
    type: "textarea",
    display: true,
  },
  date: {
    mutable: false,
    blank: false,
    type: "text",
    display: true,
  },
  ip: {
    mutable: false,
    blank: false,
    type: "text",
    display: true,
  },
};

export { LogAdminDataFormModal, logModalOptions };
