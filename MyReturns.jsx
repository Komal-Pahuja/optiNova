import { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { apiGet } from './api';
import './returns.css';

const statusBadgeClass = {
  pending: 'badge-pending',
  approved: 'badge-approved',
  rejected: 'badge-rejected',
  completed: 'badge-completed',
};
//changes in it 
const statusLabels = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  completed: 'Completed',
};

const MyReturns = () => {
  const { user } = useAuth();
  const [returns, setReturns] = useState([]);
  const [filteredReturns, setFilteredReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const backendOrigin = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await apiGet('/api/returns/my-requests');
        setReturns(data.data || []);
        setFilteredReturns(data.data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch return requests');
        setReturns([]);
        setFilteredReturns([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchReturns();
    }
  }, [user]);

  useEffect(() => {
    let filtered = returns;

    if (statusFilter) {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    if (typeFilter) {
      filtered = filtered.filter((r) => r.type === typeFilter);
    }

    setFilteredReturns(filtered);
  }, [statusFilter, typeFilter, returns]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('/uploads')) {
      return `${backendOrigin}${imagePath}`;
    }
    return imagePath;
  };

  return (
    <div className="returns-page">
      <div className="returns-container">
        <div className="returns-header">
          <h1>My Returns & Exchanges</h1>
          <p>Track the status of your return and exchange requests</p>
        </div>

        <div className="returns-filters">
          <div className="filter-group">
            <label>Filter by Status:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Filter by Type:</label>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">All Types</option>
              <option value="return">Returns</option>
              <option value="exchange">Exchanges</option>
            </select>
          </div>
        </div>

        {loading && <div className="loading-message">Loading your return requests...</div>}

        {error && <div className="error-message">{error}</div>}

        {!loading && filteredReturns.length === 0 && (
          <div className="empty-state">
            <p>No return or exchange requests found</p>
          </div>
        )}

        {!loading && filteredReturns.length > 0 && (
          <div className="returns-grid">
            {filteredReturns.map((returnRequest) => (
              <div key={returnRequest._id} className="return-card">
                <div className="card-header">
                  <div className="card-title-section">
                    <h3>{returnRequest.type === 'return' ? 'Return Request' : 'Exchange Request'}</h3>
                    <span className={`status-badge ${statusBadgeClass[returnRequest.status]}`}>
                      {statusLabels[returnRequest.status]}
                    </span>
                  </div>
                  <span className="request-date">
                    {new Date(returnRequest.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="card-body">
                  <div className="detail-row">
                    <span className="label">Product:</span>
                    <span className="value">{returnRequest.product?.name}</span>
                  </div>

                  <div className="detail-row">
                    <span className="label">Reason:</span>
                    <span className="value">{returnRequest.reason}</span>
                  </div>

                  <div className="detail-row">
                    <span className="label">Order ID:</span>
                    <span className="value">{returnRequest.order?._id}</span>
                  </div>

                  {returnRequest.message && (
                    <div className="detail-row">
                      <span className="label">Message:</span>
                      <span className="value">{returnRequest.message}</span>
                    </div>
                  )}

                  {returnRequest.adminRemark && (
                    <div className="detail-row admin-remark">
                      <span className="label">Admin Remark:</span>
                      <span className="value">{returnRequest.adminRemark}</span>
                    </div>
                  )}

                  {returnRequest.image && (
                    <div className="detail-row">
                      <span className="label">Product Image:</span>
                      <div className="image-thumbnail">
                        <img src={getImageUrl(returnRequest.image)} alt="Return product" />
                      </div>
                    </div>
                  )}

                  {returnRequest.resolvedAt && (
                    <div className="detail-row">
                      <span className="label">Resolved:</span>
                      <span className="value">{new Date(returnRequest.resolvedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReturns;
