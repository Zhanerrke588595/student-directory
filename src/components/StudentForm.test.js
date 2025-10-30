import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StudentForm from './StudentForm';

describe('StudentForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  test('renders form fields correctly', () => {
    render(<StudentForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/group/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/avatar/i)).toBeInTheDocument();
  });

  test('shows validation errors for required fields', async () => {
    render(<StudentForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    fireEvent.click(screen.getByText('Add'));
    
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Age is required')).toBeInTheDocument();
      expect(screen.getByText('Group is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  });

  test('submits form with valid data', async () => {
    render(<StudentForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/age/i), { target: { value: '20' } });
    fireEvent.change(screen.getByLabelText(/group/i), { target: { value: 'A1' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    
    fireEvent.click(screen.getByText('Add'));
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        age: '20',
        group: 'A1',
        email: 'john@example.com',
        avatar: ''
      });
    });
  });

  test('calls onCancel when cancel button is clicked', () => {
    render(<StudentForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  test('pre-fills form when editing student', () => {
    const editStudent = {
      name: 'Jane Doe',
      age: 22,
      group: 'B2',
      email: 'jane@example.com',
      avatar: 'https://example.com/avatar.jpg'
    };
    
    render(<StudentForm student={editStudent} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    expect(screen.getByDisplayValue('Jane Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('22')).toBeInTheDocument();
    expect(screen.getByDisplayValue('B2')).toBeInTheDocument();
    expect(screen.getByDisplayValue('jane@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('https://example.com/avatar.jpg')).toBeInTheDocument();
  });
});