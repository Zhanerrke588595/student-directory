import React, { useState, useEffect } from 'react';
import { validateStudentForm } from '../utils/validation';
import { createStudent, updateStudent } from '../services/apiService';

const StudentForm = ({ student, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    group: '',
    email: '',
    avatar: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarType, setAvatarType] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        age: student.age || '',
        group: student.group || '',
        email: student.email || '',
        avatar: student.avatar || ''
      });
      setAvatarPreview(student.avatar || '');
      setAvatarType(student.avatar && student.avatar.startsWith('data:image/') ? 'upload' : 'url');
    }
  }, [student]);

  const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
    
    if (name === 'avatar' && value) {
      setAvatarPreview(value);
      setAvatarType('url');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadProgress('Processing image...');
    
    try {
      // Check file size
      if (file.size > 10 * 1024 * 1024) {
        setErrors({ avatar: 'Image size should be less than 10MB' });
        setUploadProgress('');
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrors({ avatar: 'Please upload a valid image file (JPG, PNG, GIF, or WebP)' });
        setUploadProgress('');
        return;
      }
      
      // Compress image if it's large
      let processedFile = file;
      if (file.size > 2 * 1024 * 1024) { // If larger than 2MB
        setUploadProgress('Compressing image...');
        processedFile = await compressImage(file);
      }
      
      setUploadProgress('Converting to base64...');
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        
        // Check if base64 string is too long
        if (base64String.length > 1000000) { // If larger than ~1MB
          console.warn('Image is still too large after compression');
          setErrors({ 
            avatar: 'Image is too large. Please try a smaller image or use a URL instead.' 
          });
          setUploadProgress('');
          return;
        }
        
        setAvatarPreview(base64String);
        setFormData({
          ...formData,
          avatar: base64String
        });
        setAvatarType('upload');
        setUploadProgress('');
        
        console.log('Image processed successfully:', {
          originalSize: file.size,
          compressedSize: processedFile.size,
          base64Length: base64String.length
        });
      };
      
      reader.onerror = () => {
        setErrors({ avatar: 'Failed to process image. Please try another image.' });
        setUploadProgress('');
      };
      
      reader.readAsDataURL(processedFile);
      
    } catch (error) {
      console.error('Error processing image:', error);
      setErrors({ avatar: 'Failed to process image. Please try another image.' });
      setUploadProgress('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateStudentForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let result;
      if (student) {
        result = await updateStudent(student.yess, formData);
      } else {
        result = await createStudent(formData);
      }
      
      onSubmit(result);
    } catch (error) {
      console.error('Error saving student:', error);
      
      // Check if it's an image-related error
      if (error.response?.status === 413 || error.message?.includes('too large')) {
        setErrors({ 
          form: 'Image is too large for the server. Please use a smaller image or a URL instead.' 
        });
      } else if (error.response?.status === 415) {
        setErrors({ 
          form: 'Image format not supported. Please use JPG, PNG, GIF, or WebP.' 
        });
      } else {
        const errorMessage = error.response?.data?.message || 
                           error.response?.statusText || 
                           'Failed to save student. Please try again.';
        setErrors({ form: errorMessage });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="student-form">
      <h2>{student ? 'Edit Student' : 'Add New Student'}</h2>
      
      {errors.form && (
        <div className="error-message">{errors.form}</div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="Enter student name"
          />
          {errors.name && (
            <div className="error-message">{errors.name}</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="age" className="form-label">Age *</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className={`form-input ${errors.age ? 'error' : ''}`}
            placeholder="Enter student age"
          />
          {errors.age && (
            <div className="error-message">{errors.age}</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="group" className="form-label">Group *</label>
          <input
            type="text"
            id="group"
            name="group"
            value={formData.group}
            onChange={handleChange}
            className={`form-input ${errors.group ? 'error' : ''}`}
            placeholder="Enter student group"
          />
          {errors.group && (
            <div className="error-message">{errors.group}</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-input ${errors.email ? 'error' : ''}`}
            placeholder="Enter student email"
          />
          {errors.email && (
            <div className="error-message">{errors.email}</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="avatar" className="form-label">Avatar</label>
          
          {/* Загрузка изображения */}
          <div className="avatar-upload">
            <input
              type="file"
              id="avatar-upload"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleImageUpload}
              className="avatar-input"
              disabled={isSubmitting || uploadProgress}
            />
            <label htmlFor="avatar-upload" className="avatar-upload-btn">
              📷 Upload Image
            </label>
          </div>
          
          {/* Прогресс загрузки */}
          {uploadProgress && (
            <div className="upload-progress">
              <span className="progress-text">{uploadProgress}</span>
              <div className="progress-spinner"></div>
            </div>
          )}
          
          {/* Или ввод URL */}
          <div className="avatar-url-section">
            <span className="avatar-or">OR</span>
            <input
              type="text"
              id="avatar"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              className={`form-input ${errors.avatar ? 'error' : ''}`}
              placeholder="Enter avatar URL"
              disabled={isSubmitting}
            />
          </div>
          
          {/* Превью аватара */}
          {avatarPreview && (
            <div className="avatar-preview-container">
              <p className="avatar-preview-label">
                Preview {avatarType === 'upload' ? '(Uploaded Image)' : '(URL Image)'}:
              </p>
              <div className="avatar-preview">
                <img src={avatarPreview} alt="Avatar preview" />
              </div>
              {avatarType === 'upload' && (
                <p className="image-info">
                  Image size: {Math.round((avatarPreview.length * 3/4) / 1024)}KB
                </p>
              )}
            </div>
          )}
          
          {errors.avatar && (
            <div className="error-message">{errors.avatar}</div>
          )}
          
          <small className="form-hint">
            Upload images up to 10MB (will be compressed). Supported formats: JPG, PNG, GIF, WebP.
          </small>
        </div>
        
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || uploadProgress}
          >
            {isSubmitting ? 'Saving...' : (student ? 'Update' : 'Add')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;