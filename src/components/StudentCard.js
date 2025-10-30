import React, { useState } from 'react';
import Modal from './Modal';
import { deleteStudent } from '../services/apiService';

const StudentCard = ({ student, onEdit, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Используем yess как ID вместо student.id
      await deleteStudent(student.yess);
      onDelete(student.yess);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting student:', error);
      // Handle error if needed
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="student-card">
        <div className="card-header">
          <img 
            src={student.avatar || `https://picsum.photos/seed/${student.yess}/300/150.jpg`} 
            alt={`${student.name}'s avatar`} 
            className="avatar"
          />
        </div>
        <div className="card-body">
          <h3 className="student-name">{student.name}</h3>
          <p className="student-info">Age: {student.age}</p>
          <p className="student-info">Group: {student.group}</p>
          <p className="student-info">Email: {student.email}</p>
        </div>
        <div className="card-actions">
          <button className="edit-btn" onClick={() => onEdit(student)}>
            Edit
          </button>
          <button className="delete-btn" onClick={() => setShowDeleteModal(true)}>
            🗑️
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(false)}>
          <div className="delete-confirmation">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete {student.name}?</p>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default StudentCard;