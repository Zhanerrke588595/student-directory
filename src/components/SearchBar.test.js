import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('SearchBar Component', () => {
  test('renders search input with correct placeholder', () => {
    render(<SearchBar searchTerm="" onSearchChange={jest.fn()} />);
    
    const searchInput = screen.getByPlaceholderText(/search by name/i);
    expect(searchInput).toBeInTheDocument();
  });

  test('calls onSearchChange when input value changes', () => {
    const mockOnSearchChange = jest.fn();
    render(<SearchBar searchTerm="" onSearchChange={mockOnSearchChange} />);
    
    const searchInput = screen.getByPlaceholderText(/search by name/i);
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    expect(mockOnSearchChange).toHaveBeenCalledWith('John');
  });

  test('displays current search term', () => {
    render(<SearchBar searchTerm="John" onSearchChange={jest.fn()} />);
    
    const searchInput = screen.getByDisplayValue('John');
    expect(searchInput).toBeInTheDocument();
  });
});