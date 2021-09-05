import React, { useEffect, useState } from "react";
import { Professionals, Pro } from "./professionalsTypes";
import { useForm } from "react-hook-form";

import {
  Dropdown,
  Input,
  Button,
  Pagination,
  Dimmer,
  Loader,
  Segment,
  Menu,
  Label,
  Form,
} from "semantic-ui-react";
import categoriesData from "./data/categories.json";

import css from "./App.module.scss";
import { Stars } from "./components/Stars";
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
  const [selectedPage, setSelectedPage] = useState(0);
  const [categoryId, setCategoryId] = useState<number>(2);
  const [isLoading, setIsLoading] = useState<boolean | undefined>(false);
  const [postCode, setPostcode] = useState<string>("sw11");

  useEffect(() => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    fetch(URL, {
      method: "POST",
      body: `{"category_id": "${categoryId}", "location": "${postCode}"}`,
      headers: {
        "Content-Type": "application/json",
        "x-pagination-offset": (selectedPage * ITEMS_PER_PAGE).toString(),
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
        } else {
          setProfessionals([]);
          setPaginationCount(0);
        }
      })
      .catch((error) => {
        throw Error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedPage, postCode, categoryId]);

  const { handleSubmit, setValue } = useForm({
    defaultValues: { category: 2, postcode: "sw11" },
  });

  const onSubmit = (data: any) => {
    console.log(data);
    setSelectedPage(0);
    setCategoryId(data.category);
    setPostcode(data.postcode.replace(/ /g, "").toLowerCase());
  };

  const handlePageClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    data: PaginationProps
  ) => {
    if (typeof data.activePage === "number") {
      setSelectedPage(data.activePage - 1);
    }
  };

  return (
    <div className={css.App}>
      <h1>Your site</h1>
      <Form className={css.form} onSubmit={handleSubmit(onSubmit)}>
        <Form.Field inline>
          <Label pointing="right">Profession</Label>
          <Menu compact>
            <Dropdown
              simple
              item
              placeholder="Categories"
              options={categories}
              name="category"
              onChange={(e, { name, value }) => {
                setValue(name, value);
              }}
              defaultValue={categoryId}
            />
          </Menu>
        </Form.Field>

        <Form.Field inline>
          <Label pointing="right">Post code</Label>
          <Input
            size="large"
            name="postcode"
            onChange={async (e, { name, value }) => {
              setValue(name, value);
            }}
            defaultValue={postCode}
          />
        </Form.Field>
        <Form.Field inline>
          <Button type="submit" size="large">
            Submit
          </Button>
        </Form.Field>
      </Form>

      <div className={css.table}>
        <Segment className={css.segment}>
          {isLoading ? (
            <Loader active />
          ) : !!professionals.length ? (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Postcode</th>
                  <th>Review Rating</th>
                </tr>
              </thead>
              <tbody>
                {professionals.map(
                  ({ name, id, main_address, review_rating }) => {
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
                  }
                )}
              </tbody>
            </table>
          ) : (
            <p>No results. Please enter the correct postcode.</p>
          )}
        </Segment>
      </div>

      <Pagination
        activePage={selectedPage + 1}
        totalPages={Math.ceil(paginationCount / ITEMS_PER_PAGE - 1)}
        onPageChange={handlePageClick}
        disabled={isLoading}
      />
    </div>
  );
}

export default App;
