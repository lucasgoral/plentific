import React from "react";
import css from "./ProfessionalsTable.module.scss";
import { Loader, Segment } from "semantic-ui-react";
import { Stars } from "../Stars/Stars";
import { Pro } from "../../types/professionals";

interface Props {
  isLoading: boolean;
  professionals: Pro[];
}

export const ProfessionalsTable: React.FC<Props> = ({
  isLoading,
  professionals,
}) => {
  return (
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
          <p>No results for the selected profession and postcode.</p>
        )}
      </Segment>
    </div>
  );
};
