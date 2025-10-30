import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StudentCard from './StudentCard';

const mockStudent = {
yess: '1',
name: 'John Doe',
age: 20,
group: 'A1',
email: 'john@example.com',
avatar: 'https://example.com/avatar.jpg'
};

describe('StudentCard Component', () => {
test('renders student information correctly', () => {
render(<StudentCard student={mockStudent} onEdit={jest.fn()} onDelete={jest.fn()} />);

expect(screen.getByText('John Doe')).toBeInTheDocument();
expect(screen.getByText('Age: 20')).toBeInTheDocument();
expect(screen.getByText('Group: A1')).toBeInTheDocument();
expect(screen.getByText('john@example.com')).toBeInTheDocument();
});

test('calls onEdit when edit button is clicked', () => {
const mockOnEdit = jest.fn();
render(<StudentCard student={mockStudent} onEdit={mockOnEdit} onDelete={jest.fn()} />);

fireEvent.click(screen.getByText('Edit'));
expect(mockOnEdit).toHaveBeenCalledWith(mockStudent);
});

test('calls onDelete when delete button is clicked', () => {
const mockOnDelete = jest.fn();
render(<StudentCard student={mockStudent} onEdit={jest.fn()} onDelete={mockOnDelete} />);

fireEvent.click(screen.getByText('Delete'));
expect(mockOnDelete).toHaveBeenCalledWith('1');
});

test('displays placeholder avatar when no avatar provided', () => {
const studentWithoutAvatar = { ...mockStudent, avatar: '' };
render(<StudentCard student={studentWithoutAvatar} onEdit={jest.fn()} onDelete={jest.fn()} />);

const avatar = screen.getByAltText("John Doe's avatar");
expect(avatar).toHaveAttribute('src', expect.stringContaining('picsum.photos'));
});
}); 