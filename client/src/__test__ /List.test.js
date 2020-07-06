import React from "react";
import List from '../List';
import { render, screen } from "@testing-library/react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });
test("callAPI is called", () => {
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
  jest.spyOn(global, "fetch").mockImplementation(() => mockFetchPromise);
  const callAPI = jest.spyOn(List.prototype, "callAPI");
  const wrapper = shallow(<List match={{ params: { id: 1 } }} />);
  expect(callAPI).toHaveBeenCalledTimes(1);
});

test("previous and next button", () => {
  const goBack = jest.fn();
  const push = jest.fn();
  const wrapper = shallow(
    <List
      match={{ params: { id: 0 } }}
      history={{ goBack: goBack, push: push }}
    />
  );
  expect(wrapper.find("button").at(0).simulate("click"));
  expect(goBack).toHaveBeenCalledTimes(1);
  expect(wrapper.find("button").at(1).simulate("click"));
  expect(push).toHaveBeenCalledTimes(1);
});

test("dom rendered properly", () => {
  const domTree = render(<List match={{ params: { id: 1 } }} />);
  expect(domTree).toMatchInlineSnapshot(`
    Object {
      "asFragment": [Function],
      "baseElement": <body>
        <div>
          <div
            style="padding-top: 2rem;"
          >
            <h3
              class="text-center text-info pt-5"
            >
              List 
              1
            </h3>
            <div
              class="input-group mb-3"
            >
              <div
                class="input-group-prepend"
              >
                <span
                  class="input-group-text"
                  id=""
                >
                  Item and Priority
                </span>
              </div>
              <input
                class="form-control"
                name="content"
                type="text"
                value=""
              />
              <input
                class="form-control"
                type="text"
                value=""
              />
              <div
                class="input-group-append"
              >
                <input
                  class="btn btn-info btn-md"
                  type="button"
                  value="add"
                />
              </div>
            </div>
            <ul
              class="list-group"
            />
            <input
              class="btn btn-info btn-md delete-button btn-danger"
              style="display: none;"
              type="button"
              value="delete"
            />
            <div
              class="float-right navigate-div"
            >
              <button
                class="btn btn-info btn-md navigate"
                style="display: none;"
              >
                Previous
              </button>
              <button
                class="btn btn-info btn-md navigate"
                style="margin-right: 1rem;"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </body>,
      "container": <div>
        <div
          style="padding-top: 2rem;"
        >
          <h3
            class="text-center text-info pt-5"
          >
            List 
            1
          </h3>
          <div
            class="input-group mb-3"
          >
            <div
              class="input-group-prepend"
            >
              <span
                class="input-group-text"
                id=""
              >
                Item and Priority
              </span>
            </div>
            <input
              class="form-control"
              name="content"
              type="text"
              value=""
            />
            <input
              class="form-control"
              type="text"
              value=""
            />
            <div
              class="input-group-append"
            >
              <input
                class="btn btn-info btn-md"
                type="button"
                value="add"
              />
            </div>
          </div>
          <ul
            class="list-group"
          />
          <input
            class="btn btn-info btn-md delete-button btn-danger"
            style="display: none;"
            type="button"
            value="delete"
          />
          <div
            class="float-right navigate-div"
          >
            <button
              class="btn btn-info btn-md navigate"
              style="display: none;"
            >
              Previous
            </button>
            <button
              class="btn btn-info btn-md navigate"
              style="margin-right: 1rem;"
            >
              Next
            </button>
          </div>
        </div>
      </div>,
      "debug": [Function],
      "findAllByAltText": [Function],
      "findAllByDisplayValue": [Function],
      "findAllByLabelText": [Function],
      "findAllByPlaceholderText": [Function],
      "findAllByRole": [Function],
      "findAllByTestId": [Function],
      "findAllByText": [Function],
      "findAllByTitle": [Function],
      "findByAltText": [Function],
      "findByDisplayValue": [Function],
      "findByLabelText": [Function],
      "findByPlaceholderText": [Function],
      "findByRole": [Function],
      "findByTestId": [Function],
      "findByText": [Function],
      "findByTitle": [Function],
      "getAllByAltText": [Function],
      "getAllByDisplayValue": [Function],
      "getAllByLabelText": [Function],
      "getAllByPlaceholderText": [Function],
      "getAllByRole": [Function],
      "getAllByTestId": [Function],
      "getAllByText": [Function],
      "getAllByTitle": [Function],
      "getByAltText": [Function],
      "getByDisplayValue": [Function],
      "getByLabelText": [Function],
      "getByPlaceholderText": [Function],
      "getByRole": [Function],
      "getByTestId": [Function],
      "getByText": [Function],
      "getByTitle": [Function],
      "queryAllByAltText": [Function],
      "queryAllByDisplayValue": [Function],
      "queryAllByLabelText": [Function],
      "queryAllByPlaceholderText": [Function],
      "queryAllByRole": [Function],
      "queryAllByTestId": [Function],
      "queryAllByText": [Function],
      "queryAllByTitle": [Function],
      "queryByAltText": [Function],
      "queryByDisplayValue": [Function],
      "queryByLabelText": [Function],
      "queryByPlaceholderText": [Function],
      "queryByRole": [Function],
      "queryByTestId": [Function],
      "queryByText": [Function],
      "queryByTitle": [Function],
      "rerender": [Function],
      "unmount": [Function],
    }
  `);
});
