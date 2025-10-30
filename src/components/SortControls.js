import React from 'react';

const SortControls = ({ sortBy, sortOrder, onSortChange }) => {
  return (
    <div className="sort-controls">
      <label className="sort-label">Sort by:</label>
      <select 
        className="sort-select"
        value={sortBy} 
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="name">Name</option>
        <option value="age">Age</option>
        <option value="group">Group</option>
      </select>
      <button 
        className="sort-order-btn"
        onClick={() => onSortChange(sortBy)}
      >
        {sortOrder === 'asc' ? '↑' : '↓'}
      </button>
    </div>
  );
};

export default SortControls;