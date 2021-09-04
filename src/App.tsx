import React, { useEffect, useState } from "react";
import { Professionals, Pro } from "./professionalsTypes";

import { Dropdown, Input, Button, Pagination } from "semantic-ui-react";
import categoriesData from "./data/categories.json";

import css from "./App.module.scss";
import { Stars } from "./components/Stars";
import { DropdownProps } from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";
import { PaginationProps } from "semantic-ui-react/dist/commonjs/addons/Pagination/Pagination";

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
  const [isLoading, setIsLoading] = useState<boolean | undefined>(false);

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

  const handlePageClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    data: PaginationProps
  ) => {
    console.log(event);
    console.log(data);
    if (typeof data.activePage === "number") {
      setPaginationOffset(data.activePage * ITEMS_PER_PAGE);
    }
  };

  const handleCategoryChange = (
    event: React.SyntheticEvent<HTMLElement>,
    data: DropdownProps
  ) => {
    setCategoryId(data.value as number);
  };

  return (
    <div className={css.App}>
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
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Postcode</th>
              <th>Review Rating</th>
            </tr>
          </thead>
          {professionals.map(({ name, id, main_address, review_rating }) => {
            return (
              <tbody>
                <tr key={id}>
                  <td>{id}</td>
                  <td>{name}</td>
                  <td>{main_address.postcode}</td>
                  <td>
                    <Stars rating={review_rating} />
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table>
      )}
      <Pagination
        totalPages={Math.ceil(paginationCount / ITEMS_PER_PAGE)}
        onPageChange={handlePageClick}
        disabled={isLoading}
      />
    </div>
  );
}

export default App;
