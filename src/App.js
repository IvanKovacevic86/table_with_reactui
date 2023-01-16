import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import {
  MDBBtn,
  MDBBtnGroup,
  MDBCol,
  MDBContainer,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink,
  MDBRow,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdb-react-ui-kit";

function App() {
  const [data, setData] = useState([]);
  const [value, setValue] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageLimit] = useState(4);
  const [sortFilterValue, setSortFilterValue] = useState("");
  const [operation, setOperation] = useState("");

  const sortOptions = ["name", "address", "email", "phone", "status"];

  const loadUserData = (
    start,
    end,
    increase,
    optType = null,
    filterOrSortValue
  ) => {
    switch (optType) {
      case "search":
        setOperation(optType);
        setSortValue("");
        return axios
          .get(
            `http://localhost:3004/users?q=${value}&_start=${start}&_end=${end}`
          )
          .then((res) => {
            setData(res.data);
            setCurrentPage(currentPage + increase);
          });
      case "sort":
        setOperation(optType);
        setSortFilterValue(filterOrSortValue);
        return axios
          .get(
            `http://localhost:3004/users?_sort=${filterOrSortValue}&_order=asc&_start=${start}&_end=${end}`
          )
          .then((res) => {
            setData(res.data);
            setCurrentPage(currentPage + increase);
          });
      case "filter":
        setOperation(optType);
        setSortFilterValue(filterOrSortValue);
        return axios
          .get(
            `http://localhost:3004/users?status=${filterOrSortValue}&_order=asc&_start=${start}&_end=${end}`
          )
          .then((res) => {
            setData(res.data);
            setCurrentPage(currentPage + increase);
          });

      default:
        axios
          .get(`http://localhost:3004/users?_start=${start}&_end=${end}`)
          .then((response) => {
            setData(response.data);
            setCurrentPage(currentPage + increase);
          });
    }
  };

  useEffect(() => {
    loadUserData(0, 4, 0);
  }, []);

  const handleReset = () => {
    setOperation("");
    setValue("");
    setSortFilterValue("");
    setSortValue("");
    loadUserData(0, 4, 0);
  };
  const handleSearch = (e) => {
    e.preventDefault();
    loadUserData(0, 4, 0, "search");
  };

  const handleSort = (e) => {
    const value = e.target.value;
    setSortValue(value);
    loadUserData(0, 4, 0, "sort", value);
  };

  const handleFilter = (value) => {
    loadUserData(0, 4, 0, "filter", value);
  };

  const renderPagination = () => {
    if (data.length < 4 && currentPage === 0) return null;
    if (currentPage === 0) {
      return (
        <MDBPagination className="mb-0">
          <MDBPaginationItem>
            <MDBPaginationLink>1</MDBPaginationLink>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn
              onClick={() => loadUserData(4, 8, 1, operation, sortFilterValue)}
            >
              Next
            </MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      );
    } else if (currentPage < pageLimit - 1 && data.length === pageLimit) {
      return (
        <MDBPagination className="mb-0">
          <MDBPaginationItem>
            <MDBBtn
              onClick={() =>
                loadUserData(
                  (currentPage - 1) * 4,
                  currentPage * 4,
                  -1,
                  operation,
                  sortFilterValue
                )
              }
            >
              Prev
            </MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn
              onClick={() =>
                loadUserData(
                  (currentPage + 1) * 4,
                  (currentPage + 2) * 4,
                  1,
                  operation,
                  sortFilterValue
                )
              }
            >
              Next
            </MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      );
    } else {
      return (
        <MDBPagination className="mb-0">
          <MDBPaginationItem>
            <MDBBtn
              onClick={() =>
                loadUserData(
                  (currentPage - 1) * 4,
                  currentPage * 4,
                  -1,
                  operation,
                  sortFilterValue
                )
              }
            >
              Prev
            </MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
          </MDBPaginationItem>
        </MDBPagination>
      );
    }
  };

  return (
    <MDBContainer>
      <form
        style={{
          margin: "auto",
          padding: "15px",
          maxWidth: "400px",
          alignContent: "center",
        }}
        className="d-flex input-group w-auto"
        onSubmit={handleSearch}
      >
        <input
          type="text"
          className="form-control"
          placeholder="Search name..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <MDBBtn type="submit" color="dark">
          Search
        </MDBBtn>
        <MDBBtn className="mx-2" color="info" onClick={() => handleReset()}>
          Reset
        </MDBBtn>
      </form>

      <div style={{ marginTop: "100px" }}>
        <h2 className="text-center">Neca je hemija, Kosovo je Srbija!</h2>
        <MDBRow>
          <MDBCol size="12">
            <MDBTable>
              <MDBTableHead dark>
                <tr>
                  <th scope="col">No.</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Address</th>
                  <th scope="col">Status</th>
                </tr>
              </MDBTableHead>
              {data.length === 0 ? (
                <MDBTableBody className="align-centar mb-0">
                  <tr>
                    <td colSpan={8} className="text-center mb-0">
                      No data found.
                    </td>
                  </tr>
                </MDBTableBody>
              ) : (
                data.map((item) => (
                  <MDBTableBody key={item.id}>
                    <tr>
                      <th scope="row">{item.id} </th>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>
                      <td>{item.address}</td>
                      <td>{item.status}</td>
                    </tr>
                  </MDBTableBody>
                ))
              )}
            </MDBTable>
          </MDBCol>
        </MDBRow>
        <div
          style={{
            margin: "auto",
            padding: "15px",
            maxWidth: "250px",
            alignContent: "center",
          }}
        >
          {renderPagination()}
        </div>
      </div>
      {data.length > 0 && (
        <MDBRow style={{ marginBottom: "42px" }}>
          <MDBCol size="8">
            <h5>Sort By:</h5>
            <select
              style={{ width: "50%", borderRadius: "2px", height: "35px" }}
              onChange={handleSort}
              value={sortValue}
            >
              <option>Please Select Value</option>
              {sortOptions.map((item, index) => (
                <option key={index} value={item}>
                  {" "}
                  {item.slice(0, 1).toUpperCase() + item.slice(1)}
                </option>
              ))}
            </select>
          </MDBCol>
          <MDBCol size="4">
            <h5>Filter By Status: </h5>
            <MDBBtnGroup>
              <MDBBtn color="success" onClick={() => handleFilter("Active")}>
                Active
              </MDBBtn>
              <MDBBtn
                color="danger"
                style={{ marginLeft: "2px" }}
                onClick={() => handleFilter("Inactive")}
              >
                Inactive
              </MDBBtn>
            </MDBBtnGroup>
          </MDBCol>
        </MDBRow>
      )}
    </MDBContainer>
  );
}

export default App;
