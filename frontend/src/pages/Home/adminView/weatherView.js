import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";

const AdminWeatherView = (props) => {
  const [filteredWeatherList, setFilteredWeatherList] = useState(
    props.dataList
  );
  const [descending, setDescending] = useState({
    name: false,
    longitude: false,
    latitude: false,
  });
  const [searchField, setSearchField] = useState({
    option: [],
    name: "name",
    value: "",
    input: "",
  });

  useEffect(() => {
    setFilteredWeatherList(props.dataList);
  }, [props.dataList]);

  return (
    <Table striped bordered hover style={{ textAlign: "center" }}>
      <thead>
        <td>Username</td>
        <td>Password</td>
        <td>email</td>
        <td>View Mode</td>
      </thead>
      <tbody>
        {filteredWeatherList?.map((obj) => (
          <tr>
            <td>{obj.username}</td>
            <td>{obj.password}</td>
            <td>{obj.email}</td>
            <td>{obj.viewMode}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default AdminWeatherView;
