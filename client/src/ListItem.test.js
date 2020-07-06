import React, { createRef } from 'react';
import ListItem from "./ListItem";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

test("edit", () => {
  const editItemClick = jest.spyOn(ListItem.prototype, "editItemClick");
  const wrapper = shallow(<ListItem listId='1' text='listitem1' id='1' priority='1'/> );
  expect(wrapper.find("button").at(0).simulate("click"));
  expect(editItemClick).toHaveBeenCalledTimes(1);
});

test("editItemClick and editItem button", () => {
  const response = {
    id: 1,
    name: "groceries",
    items: [
      {
        id: 1,
        content: "get milk",
        priority: 1,
      },
      {
        id: 2,
        content: "get butter",
        priority: 2,
      },
    ],
  };
  const mockJsonPromise = Promise.resolve(response);
  const mockFetchPromise = Promise.resolve({
    json: () => mockJsonPromise,
  });
  jest.spyOn(ListItem.prototype, "editItem").mockImplementation(() => {})
  jest.spyOn(global, "fetch").mockImplementation(() => mockFetchPromise);
  const editItemClick = jest.spyOn(ListItem.prototype, "editItemClick");
  const wrapper = shallow(<ListItem match={{ params: { id: 1 } }} />);
  expect(wrapper.find("input").at(2).simulate("click"));
  expect(editItemClick).toHaveBeenCalledTimes(1);
  expect(wrapper.find("input").at(3).simulate("click"));
});


