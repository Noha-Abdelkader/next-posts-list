"use client";

import React from "react";
import { useEffect, useState } from "react";

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

import InputsComp from "../components/InputsComp";

export default function Home() {
  const baseURL = "https://jsonplaceholder.typicode.com";

  // set types
  interface listType {
    key: number;
    id: number;
    userId: number;
    title: string;
    body: string;
  }
  interface inputType {
    title: string;
    body: string;
    id: number;
  }

  // state
  let [list, setList] = useState<listType[]>([]);

  const [openSideBar, setOpenSideBar] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [inputs, setInputs] = useState<inputType>({
    title: "",
    body: "",
    id: 0,
  });
  // global notification setting
  notification.config({
    placement: "topRight",
    top: 50,
    duration: 3,
    rtl: true,
  });
  type NotificationType = "success" | "info" | "warning" | "error";
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (
    type: NotificationType,
    message: string,
    description?: string
  ) => {
    api[type]({
      message: message,
      description: description ?? "",
    });
  };

  // functions
  // get data
  async function getList() {
    const res = await fetch(`${baseURL}/posts`);
    const response = await res.json();
    if (res.ok) {
      // add key for table display
      let transformList = response.map((el: listType) => {
        return {
          ...el,
          key: el.id,
        };
      });
      setList(transformList);
      return response;
    }
  }

  // selected item in row
  const setItem = (record: listType) => {
    setOpenUpdate(true);
    setInputs((preState) => ({
      ...preState,
      ["title"]: record.title,
      ["body"]: record.body,
      ["id"]: record.id,
    }));
  };

  //  add
  const handleInputChange = (updatedValues: { [key: string]: string }) => {
    setInputs((prevData) => ({ ...prevData, ...updatedValues }));
  };
  async function addFunc() {
    setAddLoading(true);
    return await fetch(`${baseURL}/posts`, {
      method: "POST",
      body: JSON.stringify({
        title: inputs.title,
        body: inputs.body,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => {
        setAddLoading(false);

        const response = res.json();
        getList();
        openNotification("success", "Added successfully");
        setOpenSideBar(false);
        return response;
      })
      .catch((err) => {
        setAddLoading(false);
        openNotification("error", "Cannot add post");
      });
  }

  //  edit
  async function updateFunc(body: inputType) {
    try {
      await fetch(`${baseURL}/posts/${body.id}`, {
        method: "PUT",
        body: JSON.stringify({
          id: body.id,
          title: body.title,
          body: body.body,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      setOpenUpdate(false);
      openNotification("success", "Updated successfully");
    } catch {
      openNotification("error", "Cannot update post");
    }
  }

  //  delete
  async function deleteFunc(id: number) {
    const res = await fetch(`${baseURL}/posts/${id}`, {
      method: "DELETE",
    });
    const response = await res.json();
    if (res.ok) {
      openNotification("success", "Deleted successfully");
      getList();
      return response;
    } else {
      openNotification("error", "Cannot delete post");
    }
  }

  // reset inputs
  function resetFunc() {
    setInputs({
      title: " ",
      body: " ",
      id: 0,
    });
  }
  // calls
  useEffect(() => {
    getList();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between  bg-purple-700 py-5 px-10">
        <h1 className="font-semibold text-lg sm:text-2xl text-white ">
          Post list
        </h1>

        <Button
          onClick={() => {
            resetFunc();
            setOpenSideBar(true);
          }}
          color="default"
          variant="outlined"
          size="large"
          className=" text-purple-700 border-purple-700 hover:!bg-white hover:!text-purple-700 hover:!border-purple-700 font-semibold px-10"
        >
          Add post
        </Button>
        <Drawer
          title="Add post"
          onClose={() => {
            setOpenSideBar(false);
          }}
          open={openSideBar}
          extra={
            <Space>
              <Button
                onClick={() => setOpenSideBar(false)}
                className="hover:!border-gray-200 hover:!text-black"
              >
                Cancel
              </Button>
              <Button
                onClick={() => addFunc()}
                type="primary"
                className="bg-purple-700 hover:!bg-purple-700 "
                loading={addLoading}
              >
                Submit
              </Button>
            </Space>
          }
        >
          <InputsComp inputs={inputs} onInputChange={handleInputChange} />
        </Drawer>
      </div>
      <div className="px-10  sm:px-20 py-5">
        <Table<listType> dataSource={list} className="posts_table">
          <Column title="Title" dataIndex="title" key="title" />
          <Column title="Body" dataIndex="body" key="body" />
          <Column
            title="Action"
            key="id"
            render={(_: any, record: any) => (
              <div className="flex items-center gap-4">
                {contextHolder}
                {/* update */}
                <Button
                  type="text"
                  onClick={() => setItem(record)}
                  className="text-purple-700 border-purple-700 hover:!bg-purple-700 hover:!text-white"
                >
                 Edit
                </Button>
                <Modal
                  title="Update"
                  open={openUpdate}
                  onOk={() => updateFunc(inputs)}
                  onCancel={() => setOpenUpdate(false)}
                  okText="Confirm"
                  cancelText="Cancel"
                >
                  <InputsComp inputs={inputs} />
                </Modal>
                {/* delete */}
                <Popconfirm
                  title="Delete the post"
                  description="Are you sure to delete this post?"
                  onConfirm={() => deleteFunc(record.id)}
                  okText="Confirm"
                  cancelText="Cancel"
                >
                  <Button
                    danger
                    className="hover:!bg-[#ff4d508f] hover:!text-white"
                  >
                    Delete
                  </Button>
                </Popconfirm>
              </div>
            )}
          />
        </Table>
      </div>
    </div>
  );
}
