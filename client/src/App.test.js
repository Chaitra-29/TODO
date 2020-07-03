import React from 'react';
import { render,screen } from '@testing-library/react';;
import App from './App';

test('renders TODO header', () => {
  render(<App />);
  const text = screen.getByText(/TODO/i);
  expect(text).toBeInTheDocument();
});

test('componentDidMount and callAPI are called' , () => {
  const componentDidMount = jest.spyOn(App.prototype, 'componentDidMount');
  const callAPI = jest.spyOn(App.prototype, 'callAPI');
  render(<App />);
  expect(componentDidMount).toHaveBeenCalledTimes(1);
  expect(callAPI).toHaveBeenCalledTimes(1);
});
