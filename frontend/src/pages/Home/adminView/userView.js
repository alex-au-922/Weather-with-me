import React, { useState } from "react";
import { Table } from "react-bootstrap";
import TableSearchBar from "../../../utils/gui/tableSearchBar";

const AdminUserView = (props) => {
  const [filteredUserList, setFilteredUserList] = useState([]);
  const options = ["username", "password", "email", "viewMode"];
  return (
    <>
      <TableSearchBar
        dataList={props.dataList}
        filteredDataList={filteredUserList}
        setFilteredDataList={setFilteredUserList}
        options={options}
      />
      <Table striped bordered hover style={{ textAlign: "center" }}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Password</th>
            <th>email</th>
            <th>View Mode</th>
          </tr>
        </thead>
        <tbody>
          {filteredUserList?.map((obj, index) => (
            <tr key={index}>
              <td>{obj.username}</td>
              <td>{obj.password}</td>
              <td>{obj.email}</td>
              <td>{obj.viewMode}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default AdminUserView;
