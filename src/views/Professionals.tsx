import React, { useEffect, useState } from "react";
import { ProfessionalsResponse, Pro } from "../types/professionals";

import { Pagination } from "semantic-ui-react";

import css from "./Professionals.module.scss";

import { PaginationProps } from "semantic-ui-react/dist/commonjs/addons/Pagination/Pagination";
import { ProfessionalsTable } from "../components/ProfessionalsTable/ProfessionalsTable";
import { ProfessionalsForm } from "../components/ProfessionalsForm/ProfessionalsForm";

const ITEMS_PER_PAGE = 20;
const URL =
  "https://demo.plentific.com/uk/find-a-pro/api/v2/public/pro/search-pros/";

const Professionals = () => {
  const [paginationCount, setPaginationCount] = useState<number>(0);
  const [professionals, setProfessionals] = useState<Pro[]>([]);
  const [selectedPage, setSelectedPage] = useState(0);
  const [categoryId, setCategoryId] = useState<number>(2);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
      .then((data: ProfessionalsResponse) => {
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

  const handlePageClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    data: PaginationProps
  ) => {
    if (typeof data.activePage === "number") {
      console.log(data.activePage);
      setSelectedPage(data.activePage - 1);
    }
  };

  return (
    <div className={css.app}>
      <div className={css.header}>
        <h1>Your site</h1>
      </div>

      <ProfessionalsForm
        categoryId={categoryId}
        postCode={postCode}
        setCategoryId={setCategoryId}
        setPostcode={setPostcode}
        setSelectedPage={setSelectedPage}
      />
      <ProfessionalsTable isLoading={isLoading} professionals={professionals} />
      <Pagination
        activePage={selectedPage + 1}
        totalPages={Math.ceil(paginationCount / ITEMS_PER_PAGE)}
        onPageChange={handlePageClick}
        disabled={isLoading || paginationCount === 0}
      />
    </div>
  );
};

export default Professionals;
