import React, { useEffect, useState } from "react";
import { Professionals, Pro } from "./professionalsTypes";
import ReactPaginate from "react-paginate";

import "./App.css";
import { Stars } from "./components/Stars";

const ITEMS_PER_PAGE = 20;
const URL =
  "https://demo.plentific.com/uk/find-a-pro/api/v2/public/pro/search-pros/";

function App() {
  const [paginationCount, setPaginationCount] = useState<number>(0);
  const [professionals, setProfessionals] = useState<Pro[]>([]);
  const [paginationOffset, setPaginationOffset] = useState(0);
  useEffect(() => {
    console.log("useEffect");
    fetch(URL, {
      method: "POST",
      body: '{"category_id": 37, "location": "sw11"}',
      headers: {
        "Content-Type": "application/json",
        "x-pagination-offset": paginationOffset.toString(),
        "x-pagination-limit": ITEMS_PER_PAGE.toString(),
      },
    })
      .then((r) => {
        r.headers.forEach(function (value, name) {
          if (name === "x-pagination-count") {
            setPaginationCount(Number(value));
          }
        });
        return r.json();
      })
      .then((data: Professionals) => {
        console.log(data);
        console.log(data.response.pros);
        if (data.code === 0) {
          setProfessionals([...data.response.pros]);
        }
      })
      .catch((error) => {
        throw Error(error);
      });
  }, [paginationOffset]);

  const handlePageClick = (page: { selected: number }) => {
    setPaginationOffset(page.selected * ITEMS_PER_PAGE);
  };

  return (
    <div className="App">
      <table>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Postcode</th>
          <th>Review Rating</th>
        </tr>
        {professionals.map(({ name, id, main_address, review_rating }) => {
          return (
            <tr key={id}>
              <td>{id}</td>
              <td>{name}</td>
              <td>{main_address.postcode}</td>
              <td>
                <Stars rating={review_rating} />
              </td>
            </tr>
          );
        })}
      </table>
      <ReactPaginate
        pageCount={Math.ceil(paginationCount / ITEMS_PER_PAGE)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        // containerClassName={"pagination"}
        // activeClassName={"active"}
      />
      <b>Items count: {paginationCount}</b>
    </div>
  );
}

export default App;
