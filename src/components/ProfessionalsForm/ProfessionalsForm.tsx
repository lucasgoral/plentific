import React from "react";
import categoriesData from "../../data/categories.json";
import { Button, Dropdown, Form, Input, Label, Menu } from "semantic-ui-react";
import { useForm } from "react-hook-form";
import css from "./ProfessionalsForm.module.scss";

const categories = [
  ...categoriesData
    .filter(({ hidden }) => hidden)
    .map(({ id, name }) => ({ value: id, text: name })),
];

interface Props {
  categoryId: number;
  postCode: string;
  setCategoryId: (id: number) => void;
  setPostcode: (code: string) => void;
  setSelectedPage: (page: number) => void;
}

export const ProfessionalsForm: React.FC<Props> = ({
  categoryId,
  postCode,
  setCategoryId,
  setPostcode,
  setSelectedPage,
}) => {
  const { handleSubmit, setValue } = useForm({
    defaultValues: { category: 2, postcode: "sw11" },
  });

  const onSubmit = (data: { category: number; postcode: string }) => {
    setCategoryId(data.category);
    setPostcode(data.postcode.replace(/ /g, "").toLowerCase());
    setSelectedPage(0);
  };

  return (
    <Form className={css.form} onSubmit={handleSubmit(onSubmit)}>
      <Form.Field inline>
        <Label pointing="right">Profession</Label>
        <Menu compact>
          <Dropdown
            defaultValue={categoryId}
            item
            name="category"
            onChange={(e, { name, value }) => {
              setValue(name, value);
            }}
            options={categories}
            placeholder="Categories"
            simple
          />
        </Menu>
      </Form.Field>

      <Form.Field inline>
        <Label pointing="right">Post code</Label>
        <Input
          name="postcode"
          size="large"
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
