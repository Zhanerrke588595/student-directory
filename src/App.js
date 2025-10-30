import React, { useState, useEffect, useCallback } from 'react';
import StudentList from './components/StudentList';
import SearchBar from './components/SearchBar';
import Modal from './components/Modal';
import StudentForm from './components/StudentForm';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import Pagination from './components/Pagination';
import SortControls from './components/SortControls';
import { getStudents } from './services/apiService';
import { FaSun, FaMoon } from 'react-icons/fa';

function App() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [paginatedStudents, setPaginatedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(22);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchStudents();
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Исправленная функция фильтрации с правильной сортировкой
  const filterStudents = useCallback(() => {
    let filtered = [...students];
    
    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.name && student.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterGroup) {
      filtered = filtered.filter(student => 
        student.group === filterGroup
      );
    }
    
    // Исправленная сортировка
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Обработка null/undefined значений
      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';
      
      // Преобразуем оба значения к строкам для сравнения
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      
      // Специальная обработка для числовых полей
      if (sortBy === 'age') {
        const aNum = parseInt(aValue) || 0;
        const bNum = parseInt(bValue) || 0;
        
        if (sortOrder === 'asc') {
          return aNum - bNum;
        } else {
          return bNum - aNum;
        }
      }
      
      // Сортировка для строковых полей
      if (sortOrder === 'asc') {
        if (aStr < bStr) return -1;
        if (aStr > bStr) return 1;
        return 0;
      } else {
        if (aStr > bStr) return -1;
        if (aStr < bStr) return 1;
        return 0;
      }
    });
    
    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [students, searchTerm, filterGroup, sortBy, sortOrder]);

  useEffect(() => {
    filterStudents();
  }, [filterStudents]);

  // Pagination logic
  useEffect(() => {
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    setPaginatedStudents(filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent));
  }, [filteredStudents, currentPage, studentsPerPage]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudents();
      setStudents(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch students. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = () => {
    setShowAddModal(true);
  };

  const handleEditStudent = (student) => {
    setCurrentStudent(student);
    setShowEditModal(true);
  };

  const handleStudentAdded = (newStudent) => {
    setStudents(prevStudents => [...prevStudents, newStudent]);
    setShowAddModal(false);
    setSuccessMessage('Student added successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleStudentUpdated = (updatedStudent) => {
    setStudents(prevStudents => 
      prevStudents.map(student => 
        student.yess === updatedStudent.yess ? updatedStudent : student
      )
    );
    setShowEditModal(false);
    setCurrentStudent(null);
    setSuccessMessage('Student updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleStudentDeleted = (id) => {
    setStudents(prevStudents => 
      prevStudents.filter(student => student.yess !== id)
    );
    setSuccessMessage('Student deleted successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (group) => {
    setFilterGroup(group);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Age', 'Group', 'Email', 'Avatar'];
    const csvContent = [
      headers.join(','),
      ...filteredStudents.map(student => 
        [student.name, student.age, student.group, student.email, student.avatar]
          .map(field => `"${field || ''}"`)
          .join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'students.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getUniqueGroups = () => {
    const groups = [...new Set(students.map(student => student.group).filter(Boolean))];
    return groups;
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <header>
        <div className="container">
          <div className="header-content">
            <div className="logo">Student Directory</div>
            <div className="header-actions">
              <button className="dark-mode-toggle" onClick={toggleDarkMode}>
                 {darkMode ? <FaSun /> : <FaMoon />}
              </button>
              <button className="export-btn" onClick={exportToCSV}>
              
                 Export CSV
              </button>
              <button className="add-btn" onClick={handleAddStudent}>
                Add Student
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        {error && (
          <ErrorMessage message={error} />
        )}

        <div className="filters">
          <div className="search-bar">
            <SearchBar 
              searchTerm={searchTerm} 
              onSearchChange={handleSearchChange} 
            />
          </div>
          <div className="filter-dropdown">
            <select 
              className="filter-select" 
              value={filterGroup} 
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="">All Groups</option>
              {getUniqueGroups().map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
          <SortControls 
            sortBy={sortBy} 
            sortOrder={sortOrder} 
            onSortChange={handleSortChange} 
          />
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <StudentList 
              students={paginatedStudents} 
              onEdit={handleEditStudent}
              onDelete={handleStudentDeleted}
            />
            {filteredStudents.length > studentsPerPage && (
              <Pagination 
                currentPage={currentPage}
                totalPages={Math.ceil(filteredStudents.length / studentsPerPage)}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </main>

      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)}>
          <StudentForm 
            onSubmit={handleStudentAdded}
            onCancel={() => setShowAddModal(false)}
          />
        </Modal>
      )}

      {showEditModal && currentStudent && (
        <Modal onClose={() => setShowEditModal(false)}>
          <StudentForm 
            student={currentStudent}
            onSubmit={handleStudentUpdated}
            onCancel={() => setShowEditModal(false)}
          />
        </Modal>
      )}
    </div>
  );
}

export default App;