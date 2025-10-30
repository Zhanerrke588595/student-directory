import React from 'react';
import StudentCard from './StudentCard';

const StudentList = ({ students, onEdit, onDelete }) => {
  if (students.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📚</div>
        <h3>No students found</h3>
        <p>Try adjusting your search or filter, or add a new student.</p>
      </div>
    );
  }

  return (
    <div className="student-grid">
      {students.map(student => (
        <StudentCard 
          key={student.yess}  
          student={student} 
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default StudentList;