import { useState } from 'react';
import { usersApi } from '../services/api';
import { FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';

function ReviewForm({ providerId, appointmentId, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await usersApi.addReview({ providerId, appointmentId, rating, comment });
      toast.success('Review submitted!');
      setComment('');
      setRating(5);
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} type="button" onClick={() => setRating(star)}>
              <FiStar
                className={`text-2xl transition-colors ${
                  star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Share your experience..."
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}

export default ReviewForm;
