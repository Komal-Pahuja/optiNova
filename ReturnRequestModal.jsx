import { useState, useRef } from 'react';
import { apiPost } from './api';
import './returns.css';

const returnReasons = [
  'Defective Product',
  'Wrong Item Received',
  'Damaged During Shipping',
  'Does Not Fit',
  'Changed Mind',
  'Poor Quality',
  'Not as Described',
  'Other',
];

const ReturnRequestModal = ({ isOpen, onClose, order, product, onSuccess }) => {
  const [type, setType] = useState('return');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen || !order || !product) return null;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result || '');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!reason) {
        setError('Please select a reason');
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('orderId', order._id);
      formData.append('productId', product._id);
      formData.append('type', type);
      formData.append('reason', reason);
      formData.append('message', message);
      if (image) {
        formData.append('image', image);
      }

      const response = await fetch('/api/returns/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create return request');
      }

      const data = await response.json();
      onSuccess?.(data.data);
      handleClose();
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setType('return');
    setReason('');
    setMessage('');
    setImage(null);
    setImagePreview('');
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Request {type === 'return' ? 'Return' : 'Exchange'}</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="return-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Product</label>
            <div className="product-info">
              <span className="product-name">{product.name}</span>
            </div>
          </div>

          <div className="form-group">
            <label>Request Type *</label>
            <div className="type-options">
              <label className="radio-option">
                <input
                  type="radio"
                  value="return"
                  checked={type === 'return'}
                  onChange={(e) => setType(e.target.value)}
                />
                <span>Return</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  value="exchange"
                  checked={type === 'exchange'}
                  onChange={(e) => setType(e.target.value)}
                />
                <span>Exchange</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Reason *</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="form-input"
              required
            >
              <option value="">Select a reason...</option>
              {returnReasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Additional Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Provide any additional details about your return/exchange..."
              className="form-input"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Upload Product Image</label>
            <div className="image-upload">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                hidden
              />
              <button
                type="button"
                className="upload-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                📷 Choose Image
              </button>
            </div>
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button
                  type="button"
                  className="remove-image"
                  onClick={() => {
                    setImage(null);
                    setImagePreview('');
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={handleClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnRequestModal;
