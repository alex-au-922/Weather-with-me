import TableTitleBar from "./tableTitleBar";
import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";
import camelToCapitalize from "../../input/camelToCapitalize";
import getTitleHeader from "../../input/getTableLongHeader";
import { ReactComponent as DescendingIcon } from "./descending.svg";
import { ReactComponent as AscendingIcon } from "./ascending.svg";
import { ReactComponent as Filter } from "./filter.svg";
import { objectSetAll } from "../../object";
import sortOnKey from "../../sortOnKey";
import useForceUpdate from "../../forceUpdate";

const ResourceMangementTableHeader = (props) => {
  return (
    <th
      style={{ cursor: "pointer" }}
      onClick={() => props.setDescending(props.option, !props.isDescending)}
    >
      {props.value}
      {"\t"}
      {props.isDescending ? <DescendingIcon /> : <AscendingIcon />}
    </th>
  );
};

const ResourceManagementTableRow = (props) => {
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    forceUpdate();
  }, [props.data]);

  return (
    <tr style={{ cursor: props.renderModals ? "pointer" : "initial" }}>
      {showModal &&
        props.renderModals &&
        props.renderModals(
          props.data,
          props.modalConfig,
          showModal,
          handleCloseModal,
          props.data[props.dataUniqueKey]
        )}
      {props.fieldNames.map((fieldName, index) => (
        <td
          key={index}
          onClick={props.renderModals ? handleShowModal : () => {}}
        >
          {props.data[fieldName]}
        </td>
      ))}
    </tr>
  );
};

const OptionsFilterModal = (props) => {
  const [optionsDisplay, setOptionsDisplay] = useState(
    props.options.reduce(
      (obj, option) => (
        (obj[option] = props.displayOptions.indexOf(option) !== -1), obj
      ),
      {}
    )
  );

  const handleFilter = (event, option) => {
    let newDisplayOptions = { ...optionsDisplay };
    newDisplayOptions[option] = event.target.checked;
    const newDisplayOptionsLength = Object.keys(newDisplayOptions).filter(
      (key) => newDisplayOptions[key]
    ).length;
    if (newDisplayOptionsLength) {
      setOptionsDisplay(newDisplayOptions);
    } else {
      event.target.checked = true;
    }
  };

  useEffect(() => {
    props.setDisplayOptions(
      Object.keys(optionsDisplay).filter((key) => optionsDisplay[key])
    );
  }, [optionsDisplay]);

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Filter Table
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {Object.keys(optionsDisplay).map((option, index) => (
            <Form.Group className="mb-3" key={index}>
              <Form.Check
                type="checkbox"
                label={camelToCapitalize(option)}
                defaultChecked={optionsDisplay[option]}
                onChange={(event) => handleFilter(event, option)}
              />
            </Form.Group>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

const ResourceManagementTable = (props) => {
  const [initial, setInitial] = useState(true);
  const [filteredDataList, setFilteredDataList] = useState(props.dataList);

  const [displayOptions, setDisplayOptions] = useState(props.options);
  const [optionsDescending, setOptionsDescending] = useState(
    props.options.reduce((obj, key) => ((obj[key] = null), obj), {})
  );
  const [changedOrderKey, setChangedOrderKey] = useState(null);
  const [filterModalShow, setFilterModalShow] = useState(false);
  const forceUpdate = useForceUpdate();

  const handleFilterModalOpen = () => setFilterModalShow(true);
  const handleFilterModalClose = () => setFilterModalShow(false);

  const handleOrderChange = (tableOption, newOrder) => {
    let newOptionsDescending = objectSetAll(optionsDescending, false);
    newOptionsDescending[tableOption] = newOrder;
    setOptionsDescending(newOptionsDescending);
    setChangedOrderKey(tableOption);
  };

  useLayoutEffect(() => {
    if (filteredDataList) {
      const newFilteredDataList = sortOnKey(
        filteredDataList,
        changedOrderKey,
        optionsDescending[changedOrderKey]
      );
      setFilteredDataList(newFilteredDataList);
      forceUpdate();
    }
  }, [filteredDataList, optionsDescending]);

  return (
    <>
      <OptionsFilterModal
        show={filterModalShow}
        onHide={handleFilterModalClose}
        options={props.options}
        displayOptions={displayOptions}
        setDisplayOptions={setDisplayOptions}
      />
      <TableTitleBar
        dataList={props.dataList}
        filteredDataList={filteredDataList}
        setFilteredDataList={setFilteredDataList}
        options={displayOptions}
        optionsType={
          props.optionsType &&
          displayOptions.reduce(
            (obj, key) => ((obj[key] = props.optionsType[key]), obj),
            {}
          )
        }
        optionsAllowedTypes={[String]}
        renderSplitButton={true}
        splitButtonChild={<Filter />}
        splitButtonOptions={{ onClick: handleFilterModalOpen }}
        switchViewOptions={props.switchViewOptions}
        renderSwitchView={props.renderSwitchView}
        renderAddButton={props.renderAddButton}
        addButtonOptions={props.addButtonOptions}
      />
      <Table striped bordered hover style={{ textAlign: "center" }}>
        <thead>
          <tr>
            {displayOptions.map((option, index) => (
              <ResourceMangementTableHeader
                key={option}
                value={`${getTitleHeader(option)}`}
                isDescending={optionsDescending[option]}
                option={option}
                setDescending={handleOrderChange}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredDataList?.map((row, index) => (
            <ResourceManagementTableRow
              key={`${row[props.dataUniqueKey]},row`}
              rowIndex={index}
              fieldNames={displayOptions}
              data={row}
              dataUniqueKey={props.dataUniqueKey}
              modalConfig={props.modalConfig}
              renderModals={props.renderModals}
            />
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default ResourceManagementTable;
