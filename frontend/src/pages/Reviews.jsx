import { useEffect, useState } from 'react';
import { usersApi } from '../services/api';
import { FiStar } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDateTime } from '../utils/helpers';

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    usersApi
      .getReviews()
      .then((res) => setReviews(res.data.data?.reviews || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Reviews</h1>

      {loading ? (
        <LoadingSpinner />
      ) : reviews.length === 0 ? (
        <p className="text-center text-gray-500 py-12">
          You haven&apos;t written any reviews yet.
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-gray-900">{review.providerName || 'Provider'}</p>
                  <p className="text-xs text-gray-400">{formatDateTime(review.createdAt)}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`text-sm ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Reviews;
