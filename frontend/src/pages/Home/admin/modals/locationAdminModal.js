import getTitleHeader from "../../../../utils/input/getTableLongHeader";
import { useState, useRef, useContext, useLayoutEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { InputFormModalRow, SelectFormModalRow } from ".";
import { DeleteModal, UnsavedModal } from "../../../../utils/gui/modals";
import { objectAny, objectSetAll } from "../../../../utils/object";
import { FetchStateContext } from "../../../../middleware/fetch";
import { AuthContext } from "../../../../middleware/auth";
import { FormBufferContext } from "../contexts/formBufferProvider";
import { BACKEND_WEBSERVER_HOST } from "../../../../frontendConfig";
import resourceFetch from "../../../../utils/authUtils/resourceFetch";
import camelToCapitalize from "../../../../utils/input/camelToCapitalize";
import useForceUpdate from "../../../../utils/forceUpdate";

const BlankLocationDataFormModal = (props) => {
  const { user } = useContext(AuthContext);
  const [unsaved, setUnsaved] = useState(objectSetAll(props.data, false));
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [locationInfoError, setLocationInfoError] = useState(
    objectSetAll(props.data, "")
  );
  const formBuffer = useRef(props.data);
  const forceUpdate = useForceUpdate();

  useLayoutEffect(() => {
    const newBuffer = Object.keys(props.data)
      .filter((field) => props.modalConfig[field])
      .reduce(
        (prevBuffer, currKey) => (
          (prevBuffer[currKey] = unsaved[currKey]
            ? formBuffer[currKey]
            : props.modalConfig[currKey].blank
            ? ""
            : props.data[currKey]),
          prevBuffer
        ),
        {}
      );
    formBuffer.current = newBuffer;
    formBuffer.current = { ...newBuffer };
    forceUpdate();
  }, [props.data]);

  useLayoutEffect(() => {
    if (formBuffer.current) {
      const newUnsaved = Object.keys(unsaved).reduce(
        (obj, key) => (
          (obj[key] = props.modalConfig[key].blank
            ? formBuffer.current[key] !== ""
            : formBuffer.current[key] !== props.data[key]),
          obj
        ),
        {}
      );
      setUnsaved(newUnsaved);
    }
  }, [formBuffer.current]);

  const { fetchFactory } = useContext(FetchStateContext);
  const createFetch = fetchFactory(
    {
      success: true,
      error: true,
      loading: true,
    },
    `Successfully created location ${formBuffer.current?.name}!`,
    false,
    ["LocationNameError", "ValueError"]
  );

  const handleChangeValue = (field, changedBuffer) => {
    const newBuffer = { ...formBuffer.current };
    newBuffer[field] = changedBuffer;
    formBuffer.current = newBuffer;
    forceUpdate();
  };

  const resetUnsaved = () => {
    const resetUnsaved = objectSetAll(props.data, false);
    setUnsaved(resetUnsaved);
  };

  const handleCreateLocation = async () => {
    const url = `${BACKEND_WEBSERVER_HOST}/api/v1/resources/admin/locations`;
    const payload = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("accessToken"),
        username: user.username,
      },
      body: JSON.stringify(formBuffer.current),
    };
    const {
      success: updateLocationInfoSuccess,
      error: updateLocationInfoError,
      errorType: updateLocationInfoErrorType,
      fetching: updateLocationInfoFetching,
    } = await resourceFetch(createFetch, url, payload);
    if (!updateLocationInfoFetching) {
      if (updateLocationInfoSuccess) {
        const noError = objectSetAll(locationInfoError, false);
        handleInnerCloseModal();
        setLocationInfoError(noError);
      } else if (updateLocationInfoErrorType === "LocationNameError") {
        const newLocationInfoError = objectSetAll(locationInfoError, "");
        newLocationInfoError.name = updateLocationInfoError;
        setLocationInfoError(newLocationInfoError);
      } else if (updateLocationInfoErrorType === "ValueError") {
        const pattern = /latitude/u;
        if (updateLocationInfoError.match(pattern)) {
          const newLocationInfoError = objectSetAll(locationInfoError, "");
          newLocationInfoError.latitude = updateLocationInfoError;
          setLocationInfoError(newLocationInfoError);
        } else {
          const newLocationInfoError = objectSetAll(locationInfoError, "");
          newLocationInfoError.longitude = updateLocationInfoError;
          setLocationInfoError(newLocationInfoError);
        }
      }
    }
  };

  const handleShowUnsavedModal = () => setShowUnsavedModal(true);
  const handleCloseUnsavedModal = () => setShowUnsavedModal(false);

  const handleInnerCloseModal = () => {
    resetUnsaved();
    props.onHide();
  };

  const handleProperCloseModal = () => {
    const formUnsaved = Object.keys(unsaved).reduce(
      (accum, key) => accum || unsaved[key],
      false
    );
    if (formUnsaved) {
      handleShowUnsavedModal();
    } else {
      handleInnerCloseModal();
    }
  };

  return (
    <>
      <Modal
        show={props.show}
        onHide={handleProperCloseModal}
        centered
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        style={{
          opacity: props.show ? (showUnsavedModal ? 0.8 : 1) : 0,
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            New Location
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {Object.keys(props.data)
              .filter((field) => props.modalConfig[field])
              .map((field) => {
                return (
                  <>
                    {props.modalConfig[field].type === "select" ? (
                      <SelectFormModalRow
                        key={`${field}`}
                        field={field}
                        options={props.modalConfig[field].selectOptions}
                        readOnly={props.modalConfig[field].mutable}
                        chosenOption={props.data[field]}
                        error={locationInfoError[field]}
                        updated={unsaved[field]}
                        onChangeValue={handleChangeValue}
                      />
                    ) : (
                      <InputFormModalRow
                        key={`${field}`}
                        field={field}
                        type={props.modalConfig[field].type}
                        mutable={props.modalConfig[field].mutable}
                        placeholder={getTitleHeader(field)}
                        blank={props.modalConfig[field].blank}
                        value={props.data[field]}
                        error={locationInfoError[field]}
                        updated={unsaved[field]}
                        onChangeValue={handleChangeValue}
                      />
                    )}
                    <div className="mb-2" />
                  </>
                );
              })}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCreateLocation}>
            Create Location
          </Button>
          <Button variant="secondary" onClick={handleProperCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <UnsavedModal
        key={`${props.uniqueKey},unsaved_modal`}
        modalIndex={`${props.uniqueKey},unsaved_modal,modal`}
        show={showUnsavedModal}
        onHide={handleCloseUnsavedModal}
        title={"Unsaved Data"}
        body={"You have unsaved data. Are you sure you want to close the form?"}
        forceClose={handleInnerCloseModal}
      />
    </>
  );
};

const LocationAdminDataFormModal = (props) => {
  const locationData = Object.keys(props.data)
    .filter((field) => props.modalConfig[field])
    .filter((key) => props.modalConfig[key].mutable)
    .reduce((obj, key) => ((obj[key] = props.data[key]), obj), {});
  const locationName = props.data.name;
  const [unsaved, setUnsaved] = useState(objectSetAll(locationData, false));
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { user } = useContext(AuthContext);
  const [locationInfoError, setLocationInfoError] = useState(
    objectSetAll(locationData, "")
  );
  const forceUpdate = useForceUpdate();

  const formBuffer = useRef(locationData);

  // useLayoutEffect(() => {
  //   const newBuffer = Object.keys(unsaved).reduce(
  //     (prevBuffer, currKey) => (
  //       (prevBuffer[currKey] = unsaved[currKey]
  //         ? formBuffer[currKey]
  //         : props.modalConfig[currKey].blank
  //         ? ""
  //         : props.data[currKey]),
  //       prevBuffer
  //     ),
  //     {}
  //   );
  //   formBuffer.current = { ...newBuffer };
  //   forceUpdate();
  // }, [props.data]);

  useLayoutEffect(() => {
    if (formBuffer.current) {
      console.log(formBuffer.current);
      const newUnsaved = Object.keys(formBuffer.current).reduce(
        (obj, key) => (
          (obj[key] = props.modalConfig[key].blank
            ? formBuffer.current[key] !== ""
            : formBuffer.current[key] !== props.data[key]),
          obj
        ),
        {}
      );
      console.log("new unsaved", newUnsaved);
      setUnsaved(newUnsaved);
    }
  }, [formBuffer.current]);

  const { fetchFactory, fetchState } = useContext(FetchStateContext);
  const updateFetch = fetchFactory(
    {
      success: true,
      error: true,
      loading: true,
    },
    `Successfully updated location ${locationName} info!`,
    false,
    ["LocationNameError", "ValueError"]
  );

  const deleteFetch = fetchFactory(
    {
      success: true,
      error: true,
      loading: true,
    },
    `Successfully deleted location ${locationName}!`
  );

  const resetUnsaved = () => {
    const resetUnsaved = objectSetAll(locationData, false);
    setUnsaved(resetUnsaved);
  };

  const handleChangeValue = (field, changedBuffer) => {
    const newBuffer = { ...formBuffer.current };
    newBuffer[field] = changedBuffer;
    formBuffer.current = newBuffer;
    forceUpdate();
    console.log("new formBuffer value", formBuffer.current);
  };

  const handleShowUnsavedModal = () => setShowUnsavedModal(true);
  const handleCloseUnsavedModal = () => setShowUnsavedModal(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleSaveChange = async () => {
    const url = `${BACKEND_WEBSERVER_HOST}/api/v1/resources/admin/locations`;
    const payload = {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("accessToken"),
        username: user.username,
      },
      body: JSON.stringify({
        oldName: locationData.name,
        newData: formBuffer.current,
      }),
    };
    const {
      success: updateLocationInfoSuccess,
      error: updateLocationInfoError,
      errorType: updateLocationInfoErrorType,
      fetching: updateLocationInfoFetching,
    } = await resourceFetch(updateFetch, url, payload);
    if (!updateLocationInfoFetching) {
      if (updateLocationInfoSuccess) {
        handleInnerCloseModal();
        setLocationInfoError(objectSetAll(locationInfoError, false));
      } else if (updateLocationInfoErrorType === "LocationNameError") {
        const newLocationInfoError = objectSetAll(locationInfoError, "");
        newLocationInfoError.name = updateLocationInfoError;
        setLocationInfoError(newLocationInfoError);
      } else if (updateLocationInfoErrorType === "ValueError") {
        const pattern = /latitude/u;
        if (updateLocationInfoError.match(pattern)) {
          const newLocationInfoError = objectSetAll(locationInfoError, "");
          newLocationInfoError.latitude = updateLocationInfoError;
          setLocationInfoError(newLocationInfoError);
        } else {
          const newLocationInfoError = objectSetAll(locationInfoError, "");
          newLocationInfoError.longitude = updateLocationInfoError;
          setLocationInfoError(newLocationInfoError);
        }
      }
    }
  };

  const handleDeleteLocation = async () => {
    const url = `${BACKEND_WEBSERVER_HOST}/api/v1/resources/admin/locations`;
    const payload = {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("accessToken"),
        username: user.username,
      },
      body: JSON.stringify({
        name: formBuffer.current.name,
      }),
    };
    const { success: deleteLocationSuccess, fetching: deleteLocationFetching } =
      await resourceFetch(deleteFetch, url, payload);
    if (!deleteLocationFetching) {
      if (deleteLocationSuccess) handleInnerCloseModal();
    }
  };

  const handleInnerCloseModal = () => {
    resetUnsaved();
    props.onHide();
  };

  const handleProperCloseModal = () => {
    const formUnsaved = Object.keys(unsaved)
      .filter((field) => props.modalConfig[field])
      .reduce((accum, key) => accum || unsaved[key], false);
    if (formUnsaved) {
      handleShowUnsavedModal();
    } else {
      handleInnerCloseModal();
    }
  };
  return (
    <>
      <Modal
        show={props.show}
        onHide={handleProperCloseModal}
        centered
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        animation={false}
        style={{
          opacity: props.show
            ? showUnsavedModal || showDeleteModal || objectAny(fetchState, true)
              ? 0.7
              : 1
            : 0,
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Weather Data
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{maxHeight: "70vh", overflowY: "auto"}}>
          <Form>
            {Object.keys(props.data)
              .filter((field) => props.modalConfig[field])
              .map((field) => {
                return (
                  <>
                    {props.modalConfig[field].type === "select" ? (
                      <SelectFormModalRow
                        key={`${field}`}
                        field={field}
                        readOnly={props.modalConfig[field].mutable}
                        options={props.modalConfig[field].selectOptions}
                        chosenOption={props.data[field]}
                        error={locationInfoError[field]}
                        updated={unsaved[field]}
                        onChangeValue={handleChangeValue}
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
                        error={locationInfoError[field]}
                        updated={unsaved[field]}
                        onChangeValue={handleChangeValue}
                      />
                    )}
                    <div className="mb-2" />
                  </>
                );
              })}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleShowDeleteModal}>
            Delete
          </Button>
          <Button variant="primary" onClick={handleSaveChange}>
            Save Change
          </Button>
          <Button variant="secondary" onClick={handleProperCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <UnsavedModal
        key={`${props.uniqueKey},unsaved_modal`}
        modalIndex={`${props.uniqueKey},unsaved_modal,modal`}
        show={showUnsavedModal}
        onHide={handleCloseUnsavedModal}
        title={"Unsaved Data"}
        body={"You have unsaved data. Are you sure you want to close the form?"}
        forceClose={handleInnerCloseModal}
      />
      <DeleteModal
        key={`${props.uniqueKey},delete_modal`}
        modalIndex={`${props.uniqueKey},delete_modal,modal`}
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        title={"Notice"}
        body={`Are you sure to delete location ${locationName}?`}
        delete={handleDeleteLocation}
      />
    </>
  );
};

const locationModalOptions = {
  name: {
    mutable: true,
    blank: false,
    type: "text",
  },
  latitude: {
    mutable: true,
    blank: false,
    type: "text",
  },
  longitude: {
    mutable: true,
    blank: false,
    type: "text",
  },
  time: {
    mutable: false,
    blank: false,
    type: "text",
  },
  temperature: {
    mutable: false,
    blank: false,
    type: "text",
  },
  tenMinMaxGust: {
    mutable: false,
    blank: false,
    type: "text",
  },
  tenMinMeanWindDir: {
    mutable: false,
    blank: false,
    type: "text",
  },
  tenMinMeanWindSpeed: {
    mutable: false,
    blank: false,
    type: "text",
  },
  relativeHumidity: {
    mutable: false,
    blank: false,
    type: "text",
  },
};

export {
  BlankLocationDataFormModal,
  LocationAdminDataFormModal,
  locationModalOptions,
};
