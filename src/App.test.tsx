import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Anime List', () => {
  render(<App />);
  const linkElement = screen.getByText(/Anime List/i);
  expect(linkElement).toBeInTheDocument();
});
