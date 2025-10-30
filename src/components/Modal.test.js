import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

describe('Modal Component', () => {
  test('renders children content', () => {
    render(
      <Modal onClose={jest.fn()}>
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  test('calls onClose when overlay is clicked', () => {
    const mockOnClose = jest.fn();
    render(
      <Modal onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );
    
    const overlay = screen.getByText('Modal Content').closest('.modal-overlay');
    fireEvent.click(overlay);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('does not call onClose when modal content is clicked', () => {
    const mockOnClose = jest.fn();
    render(
      <Modal onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );
    
    const modalContent = screen.getByText('Modal Content').closest('.modal-content');
    fireEvent.click(modalContent);
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});