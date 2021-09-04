import React, { useEffect, useState } from "react";
import { Professionals, Pro } from "./professionalsTypes";
import ReactPaginate from "react-paginate";
import { Dropdown, Input, Button, DropdownItemProps } from "semantic-ui-react";
import categoriesData from "./data/categories.json";

import "./App.css";
import { Stars } from "./components/Stars";
import { DropdownProps } from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";

const ITEMS_PER_PAGE = 20;
const URL =
  "https://demo.plentific.com/uk/find-a-pro/api/v2/public/pro/search-pros/";

const categories = [
  ...categoriesData
    .filter(({ hidden }) => hidden)
    .map(({ id, name }) => ({ value: id, text: name })),
];

console.log(categoriesData);
function App() {
  const [paginationCount, setPaginationCount] = useState<number>(0);
  const [professionals, setProfessionals] = useState<Pro[]>([]);
  const [paginationOffset, setPaginationOffset] = useState(0);
  const [categoryId, setCategoryId] = useState<number>(2);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    fetch(URL, {
      method: "POST",
      body: `{"category_id": ${categoryId} , "location": "sw11"}`,
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
        if (data.code === 0) {
          setProfessionals([...data.response.pros]);
        }
      })
      .catch((error) => {
        throw Error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [paginationOffset, categoryId]);

  const handlePageClick = (page: { selected: number }) => {
    console.log(page.selected);
    setPaginationOffset(page.selected * ITEMS_PER_PAGE);
  };

  const handleCategoryChange = (
    event: React.SyntheticEvent<HTMLElement>,
    data: DropdownProps
  ) => {
    setCategoryId(data.value as number);
  };

  return (
    <div className="App">
      <div>
        <h1>Your site</h1>
        <form>
          <Dropdown
            placeholder="Categories"
            options={categories}
            onChange={handleCategoryChange}
            defaultValue={categoryId}
          ></Dropdown>
          <Input label="Post code"></Input>
          <Button>Submit</Button>
        </form>
      </div>
      {isLoading ? (
        "Loading data..."
      ) : (
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
      )}
      <ReactPaginate
        pageCount={Math.ceil(paginationCount / ITEMS_PER_PAGE)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        // containerClassName={"pagination"}
        // activeClassName={"active"}
        // disableInitialCallback={true}
      />
      <b>Items count: {paginationCount}</b>
    </div>
  );
}

export default App;
