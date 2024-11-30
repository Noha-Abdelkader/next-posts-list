import React from "react";
import {
  Space,
  Table,
  Tag,
  Popconfirm,
  Button,
  Modal,
  Input,
  notification,
  Drawer,
} from "antd";
const { Column, ColumnGroup } = Table;
const { TextArea } = Input;

export default function inputsComp({ inputs, onInputChange }: any) {
  interface inputType {
    title: string;
    body: string;
    id: number;
  }
   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const { name, value } = e.target;
     onInputChange({ [name]: value }); // Pass updated input back to parent
   };
 

  return (
    <div className="flex flex-col gap-5">
      {/* title */}
      <div>
        <label htmlFor="title">
          <span className="font-semibold">Title</span>
          <Input
            placeholder="Basic usage"
            value={inputs.title}
            onChange={handleChange}
            name="title"
          />
        </label>
      </div>
      {/* body */}
      <div>
        <label htmlFor="body">
          <span className="font-semibold">Body</span>
          <TextArea
            placeholder="Controlled autosize"
            value={inputs.body}
            autoSize={{ minRows: 3, maxRows: 5 }}
            onChange={handleChange}
            name="body"
          />
        </label>
      </div>
    </div>
  );
}
