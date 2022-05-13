import camelToCapitalize from "../../../../utils/input/camelToCapitalize";
import React, {
  useState,
  useEffect,
  useContext,
  useLayoutEffect,
  useRef,
} from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { InputFormModalRow, SelectFormModalRow } from ".";
import { DeleteModal, UnsavedModal } from "../../../../utils/gui/modals";
import resourceFetch from "../../../../utils/authUtils/resourceFetch";
import { FetchStateContext } from "../../../../middleware/fetch";
import { AuthContext } from "../../../../middleware/auth";
import { BACKEND_WEBSERVER_HOST } from "../../../../frontendConfig";
import { objectSetAll } from "../../../../utils/object";
import checkString from "../../../../utils/input/checkString";
import validateEmail from "../../../../utils/input/checkEmail";
import useForceUpdate from "../../../../utils/forceUpdate";

const BlankUserDataFormModal = (props) => {
  const { user } = useContext(AuthContext);
  const [unsaved, setUnsaved] = useState(objectSetAll(props.data, false));
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [userInfoError, setUserInfoError] = useState(
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
            ? formBuffer.current[currKey]
            : props.modalConfig[currKey].blank
            ? ""
            : props.data[currKey]),
          prevBuffer
        ),
        {}
      );
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
    `Successfully created user ${formBuffer.current?.username}!`,
    false,
    ["UsernameError", "PasswordError", "EmailError"]
  );

  const handleChangeValue = (field, changedBuffer) => {
    const newFormBuffer = { ...formBuffer.current };
    newFormBuffer[field] = changedBuffer;
    formBuffer.current = newFormBuffer;
    forceUpdate();
  };

  const resetUnsaved = () => {
    const resetUnsaved = objectSetAll(props.data, false);
    setUnsaved(resetUnsaved);
  };

  const handleCreateUser = async () => {
    const { success: usernameCheckSuccess, error: usernameCheckError } =
      checkString(formBuffer.current.username);
    if (!usernameCheckSuccess) {
      const newUserInfoError = objectSetAll(userInfoError, "");
      newUserInfoError.username = usernameCheckError;
      setUserInfoError(newUserInfoError);
      return;
    }

    const { success: passwordCheckSuccess, error: passwordCheckError } =
      checkString(formBuffer.current.password);
    if (!passwordCheckSuccess) {
      const newUserInfoError = objectSetAll(userInfoError, "");
      newUserInfoError.password = passwordCheckError;
      setUserInfoError(newUserInfoError);
      return;
    }

    if (formBuffer.email && unsaved.email) {
      const { success: emailCheckSuccess, error: emailCheckError } =
        validateEmail(formBuffer.current.email);
      if (!emailCheckSuccess) {
        const newUserInfoError = objectSetAll(userInfoError, "");
        newUserInfoError.email = emailCheckError;
        setUserInfoError(newUserInfoError);
        return;
      }
    }
    const url = `${BACKEND_WEBSERVER_HOST}/api/v1/resources/admin/users`;
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
      success: updateUserInfoSuccess,
      error: updateUserInfoError,
      errorType: updateUserInfoErrorType,
      fetching: updateUserInfoFetching,
    } = await resourceFetch(createFetch, url, payload);
    if (!updateUserInfoFetching) {
      if (updateUserInfoSuccess) {
        const noError = objectSetAll(userInfoError, false);
        handleInnerCloseModal();
        setUserInfoError(noError);
      } else if (updateUserInfoErrorType === "UsernameError") {
        const newUserInfoError = objectSetAll(userInfoError, "");
        newUserInfoError.username = updateUserInfoError;
        setUserInfoError(newUserInfoError);
      } else if (updateUserInfoErrorType === "PasswordError") {
        const newUserInfoError = objectSetAll(userInfoError, "");
        newUserInfoError.password = updateUserInfoError;
        setUserInfoError(newUserInfoError);
      } else if (updateUserInfoErrorType === "EmailError") {
        const newUserInfoError = objectSetAll(userInfoError, "");
        newUserInfoError.email = updateUserInfoError;
        setUserInfoError(newUserInfoError);
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
          <Modal.Title id="contained-modal-title-vcenter">New User</Modal.Title>
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
                        chosenOption={formBuffer.current[field]}
                        error={userInfoError[field]}
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
                        value={formBuffer.current[field]}
                        error={userInfoError[field]}
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
          <Button variant="primary" onClick={handleCreateUser}>
            Create User
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

const UserDataFormModal = (props) => {
  const { user } = useContext(AuthContext);
  const { username } = props.data;
  const [unsaved, setUnsaved] = useState(
    Object.keys(props.data).reduce((obj, key) => ((obj[key] = false), obj), {})
  );
  const formBuffer = useRef(
    Object.keys(props.data)
      .filter((field) => props.modalConfig[field])
      .reduce(
        (obj, key) => (
          (obj[key] = props.modalConfig[key].blank ? "" : props.data[key]), obj
        ),
        {}
      )
  );
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userInfoError, setUserInfoError] = useState(
    Object.keys(props.data).reduce((obj, key) => ((obj[key] = ""), obj), {})
  );
  const forceUpdate = useForceUpdate();

  useLayoutEffect(() => {
    const newBuffer = Object.keys(props.data)
      .filter((field) => props.modalConfig[field])
      .reduce(
        (prevBuffer, currKey) => (
          (prevBuffer[currKey] = unsaved[currKey]
            ? formBuffer.current[currKey]
            : props.modalConfig[currKey].blank
            ? ""
            : props.data[currKey]),
          prevBuffer
        ),
        {}
      );
    formBuffer.current = { ...newBuffer };
    forceUpdate();
  }, [props.data]);

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

  const { fetchFactory } = useContext(FetchStateContext);
  const updateFetch = fetchFactory(
    {
      success: true,
      error: true,
      loading: true,
    },
    `Successfully updated user ${username} info!`,
    false,
    ["UsernameError", "PasswordError", "EmailError"]
  );

  const deleteFetch = fetchFactory(
    {
      success: true,
      error: true,
      loading: true,
    },
    `Successfully deleted user ${username}!`
  );
  const resetUnsaved = () => {
    const resetUnsaved = objectSetAll(props.data, false);
    setUnsaved(resetUnsaved);
  };

  const handleSaveChange = async () => {
    if (unsaved.username) {
      const { success: usernameCheckSuccess, error: usernameCheckError } =
        checkString(formBuffer.current.username);
      if (!usernameCheckSuccess) {
        const newUserInfoError = objectSetAll(userInfoError, "");
        newUserInfoError.username = usernameCheckError;
        setUserInfoError(newUserInfoError);
        return;
      }
    }

    if (formBuffer.current.password && unsaved.password) {
      const { success: passwordCheckSuccess, error: passwordCheckError } =
        checkString(formBuffer.current.password);
      if (!passwordCheckSuccess) {
        const newUserInfoError = objectSetAll(userInfoError, "");
        newUserInfoError.password = passwordCheckError;
        setUserInfoError(newUserInfoError);
        return;
      }
    }
    if (formBuffer.current.email && unsaved.email) {
      const { success: emailCheckSuccess, error: emailCheckError } =
        validateEmail(formBuffer.current.email);
      if (!emailCheckSuccess) {
        const newUserInfoError = objectSetAll(userInfoError, "");
        newUserInfoError.email = emailCheckError;
        setUserInfoError(newUserInfoError);
        return;
      }
    }

    const url = `${BACKEND_WEBSERVER_HOST}/api/v1/resources/admin/users`;
    const payload = {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("accessToken"),
        username: user.username,
      },
      body: JSON.stringify({
        oldUsername: username,
        newData: formBuffer.current,
      }),
    };
    const {
      success: updateUserInfoSuccess,
      error: updateUserInfoError,
      errorType: updateUserInfoErrorType,
      fetching: updateUserInfoFetching,
    } = await resourceFetch(updateFetch, url, payload);
    if (!updateUserInfoFetching) {
      if (updateUserInfoSuccess) {
        const noError = objectSetAll(userInfoError, false);
        handleInnerCloseModal();
        setUserInfoError(noError);
      } else if (updateUserInfoErrorType === "UsernameError") {
        const newUserInfoError = objectSetAll(userInfoError, "");
        newUserInfoError.username = updateUserInfoError;
        setUserInfoError(newUserInfoError);
      } else if (updateUserInfoErrorType === "PasswordError") {
        const newUserInfoError = objectSetAll(userInfoError, "");
        newUserInfoError.password = updateUserInfoError;
        setUserInfoError(newUserInfoError);
      } else if (updateUserInfoErrorType === "EmailError") {
        const newUserInfoError = objectSetAll(userInfoError, "");
        newUserInfoError.email = updateUserInfoError;
        setUserInfoError(newUserInfoError);
      }
    }
  };

  const handleDeleteUser = async () => {
    const url = `${BACKEND_WEBSERVER_HOST}/api/v1/resources/admin/users`;
    const payload = {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("accessToken"),
        username: user.username,
      },
      body: JSON.stringify({
        username,
      }),
    };
    const { success: deleteUserSuccess, fetching: deleteUserFetching } =
      await resourceFetch(deleteFetch, url, payload);
    if (!deleteUserFetching) {
      if (deleteUserSuccess) handleInnerCloseModal();
    }
  };

  const handleChangeValue = (field, changedBuffer) => {
    const newFormBuffer = { ...formBuffer.current };
    newFormBuffer[field] = changedBuffer;
    formBuffer.current = newFormBuffer;
    forceUpdate();
  };

  const handleShowUnsavedModal = () => setShowUnsavedModal(true);
  const handleCloseUnsavedModal = () => setShowUnsavedModal(false);

  const handleShowDeleteModal = () => setShowDeleteModal(true);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

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
          opacity: props.show
            ? showUnsavedModal || showDeleteModal
              ? 0.8
              : 1
            : 0,
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            User Data
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
                        key={`${props.uniqueKey} ${field}`}
                        field={field}
                        options={props.modalConfig[field].selectOptions}
                        readOnly={props.modalConfig[field].mutable}
                        chosenOption={formBuffer.current[field]}
                        error={userInfoError[field]}
                        updated={unsaved[field]}
                        onChangeValue={handleChangeValue}
                      />
                    ) : (
                      <InputFormModalRow
                        key={`${props.uniqueKey} ${field}`}
                        field={field}
                        type={props.modalConfig[field].type}
                        mutable={props.modalConfig[field].mutable}
                        placeholder={camelToCapitalize(field)}
                        blank={props.modalConfig[field].blank}
                        value={formBuffer.current[field]}
                        error={userInfoError[field]}
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
        body={`Are you sure to delete user ${props.data.username}?`}
        delete={handleDeleteUser}
      />
    </>
  );
};

const userModalOptions = {
  username: {
    mutable: true,
    blank: false,
    type: "text",
  },
  password: {
    mutable: true,
    blank: true,
    type: "text",
  },
  email: {
    mutable: true,
    blank: false,
    type: "email",
  },
  viewMode: {
    mutable: true,
    type: "select",
    selectOptions: ["default", "dark"],
  },
};

export { BlankUserDataFormModal, UserDataFormModal, userModalOptions };
