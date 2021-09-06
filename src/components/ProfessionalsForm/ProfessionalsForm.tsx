import React from "react";
import { Button, Dropdown, Form, Input, Label, Menu } from "semantic-ui-react";
import css from "./ProfessionalsForm.module.scss";

import categoriesData from "../../data/categories.json";
import { useForm } from "react-hook-form";

const categories = [
  ...categoriesData
    .filter(({ hidden }) => hidden)
    .map(({ id, name }) => ({ value: id, text: name })),
];

interface Props {
  setSelectedPage: (page: number) => void;
  setCategoryId: (id: number) => void;
  setPostcode: (code: string) => void;
  postCode: string;
  categoryId: number;
}

export const ProfessionalsForm: React.FC<Props> = ({
  setSelectedPage,
  setCategoryId,
  setPostcode,
  postCode,
  categoryId,
}) => {
  const { handleSubmit, setValue } = useForm({
    defaultValues: { category: 2, postcode: "sw11" },
  });

  const onSubmit = (data: { category: number; postcode: string }) => {
    setSelectedPage(0);
    setCategoryId(data.category);
    setPostcode(data.postcode.replace(/ /g, "").toLowerCase());
  };

  return (
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
  );
};
