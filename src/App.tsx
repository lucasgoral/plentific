import React, { useEffect, useState } from "react";
import { Professionals, Pro } from "./professionalsTypes";

import "./App.css";

const URL =
  "https://demo.plentific.com/uk/find-a-pro/api/v2/public/pro/search-pros/";

function App() {
  const [paginationCount, setPaginationCount] = useState<number | null>(null);
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
        "x-pagination-limit": "10",
      },
    })
      .then((response) => response)
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

  const handleNextBt = () => {
    setPaginationOffset(paginationOffset + 10);
  };

  return (
    <div className="App">
      <table>
        {professionals.map(({ name, id, review_rating }) => {
          return (
            <tr key={id}>
              <td>{name}</td>

              <td>{review_rating}</td>
            </tr>
          );
        })}
      </table>
      <button onClick={handleNextBt}>Next</button>
    </div>
  );
}

export default App;
