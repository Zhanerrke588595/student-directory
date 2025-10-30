import axios from 'axios';

const API_URL = 'https://69005895ff8d792314b96eb6.mockapi.io/students';

export const getStudents = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

export const getStudent = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student:', error);
    throw error;
  }
};

export const createStudent = async (studentData) => {
  try {
    console.log('Creating student with data:', {
      ...studentData,
      avatar: studentData.avatar ? `${studentData.avatar.substring(0, 50)}... (${studentData.avatar.length} chars)` : 'none'
    });
    
    const isBase64 = studentData.avatar && studentData.avatar.startsWith('data:image/');
    const isLongUrl = studentData.avatar && studentData.avatar.length > 200 && !isBase64;
    
    const preparedData = {
      name: studentData.name,
      age: studentData.age,
      group: studentData.group,
      email: studentData.email,
      avatar: isBase64 
        ? studentData.avatar 
        : isLongUrl 
          ? `https://picsum.photos/seed/${Date.now()}/300/150.jpg` 
          : studentData.avatar || `https://picsum.photos/seed/${Date.now()}/300/150.jpg`,
      yess: Date.now().toString()
    };
    
    // Проверяем размер данных перед отправкой
    const dataSize = JSON.stringify(preparedData).length;
    console.log('Request data size:', dataSize, 'characters');
    
    if (dataSize > 1000000) { // Если запрос больше ~1MB
      throw new Error('Request data too large. Please use a smaller image or URL.');
    }
    
    const response = await axios.post(API_URL, preparedData);
    console.log('Create student response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating student:', error.response ? error.response.data : error.message);
    
    // Добавляем больше информации об ошибке
    if (error.code === 'ERR_NETWORK') {
      error.message = 'Network error. Please check your internet connection.';
    } else if (error.response?.status === 413) {
      error.message = 'Request entity too large. Image is too big for the server.';
    } else if (error.response?.status === 415) {
      error.message = 'Unsupported media type. Image format not supported.';
    }
    
    throw error;
  }
};

export const updateStudent = async (id, studentData) => {
  try {
    console.log('Updating student with ID:', id, 'and data:', {
      ...studentData,
      avatar: studentData.avatar ? `${studentData.avatar.substring(0, 50)}... (${studentData.avatar.length} chars)` : 'none'
    });
    
    const isBase64 = studentData.avatar && studentData.avatar.startsWith('data:image/');
    const isLongUrl = studentData.avatar && studentData.avatar.length > 200 && !isBase64;
    
    const preparedData = {
      name: studentData.name,
      age: studentData.age,
      group: studentData.group,
      email: studentData.email,
      avatar: isBase64 
        ? studentData.avatar 
        : isLongUrl 
          ? `https://picsum.photos/seed/${id}/300/150.jpg` 
          : studentData.avatar || `https://picsum.photos/seed/${id}/300/150.jpg`
    };
    
    const dataSize = JSON.stringify(preparedData).length;
    console.log('Update request data size:', dataSize, 'characters');
    
    if (dataSize > 1000000) {
      throw new Error('Request data too large. Please use a smaller image or URL.');
    }
    
    const response = await axios.put(`${API_URL}/${id}`, preparedData);
    console.log('Update student response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating student:', error.response ? error.response.data : error.message);
    
    if (error.code === 'ERR_NETWORK') {
      error.message = 'Network error. Please check your internet connection.';
    } else if (error.response?.status === 413) {
      error.message = 'Request entity too large. Image is too big for the server.';
    } else if (error.response?.status === 415) {
      error.message = 'Unsupported media type. Image format not supported.';
    }
    
    throw error;
  }
};

export const deleteStudent = async (id) => {
  try {
    console.log('Deleting student with ID:', id);
    await axios.delete(`${API_URL}/${id}`);
    return id;
  } catch (error) {
    console.error('Error deleting student:', error.response ? error.response.data : error.message);
    throw error;
  }
};