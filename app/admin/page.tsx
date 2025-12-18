"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Pagination } from "@/app/components/Pagination";

type FeedbackItem = {
  id: string;
  message: string;
  createdAt: string;
};

type PaginationMetadata = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export default function AdminPage() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMetadata>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const pageParam = searchParams.get('page');
    const sortParam = searchParams.get('sort');

    if (pageParam) {
      setPagination(prev => ({ ...prev, page: parseInt(pageParam, 10) }));
    }
    if (sortParam && (sortParam === 'asc' || sortParam === 'desc')) {
      setSort(sortParam);
    }
  }, []);

  useEffect(() => {
    fetchFeedback();
  }, [pagination.page, sort]);

  async function fetchFeedback() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/feedback?page=${pagination.page}&limit=10&sort=${sort}`);

      if (!res.ok) {
        throw new Error("Failed to fetch feedback");
      }

      const data = await res.json();
      setFeedback(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  function updateURL(newPage: number, newSort: 'asc' | 'desc') {
    const params = new URLSearchParams();
    params.set('page', newPage.toString());
    params.set('sort', newSort);
    router.push(`/admin?${params.toString()}`);
  }

  function handlePageChange(newPage: number) {
    setPagination(prev => ({ ...prev, page: newPage }));
    updateURL(newPage, sort);
  }

  function handleSortChange(newSort: 'asc' | 'desc') {
    setSort(newSort);
    setPagination(prev => ({ ...prev, page: 1 }));
    updateURL(1, newSort);
  }

  if (loading) {
    return (
      <main className="p-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">All Feedback</h1>
        <p className="text-gray-600">Loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">All Feedback</h1>
        <div className="bg-red-50 border border-red-200 p-4 rounded">
          <p className="text-red-800 mb-2">{error}</p>
          <button
            onClick={() => fetchFeedback()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  if (pagination.total === 0) {
    return (
      <main className="p-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">All Feedback</h1>
        <p className="text-gray-600">No feedback submitted yet</p>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Feedback</h1>

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-gray-600">
            Sort:
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => handleSortChange(e.target.value as 'asc' | 'desc')}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      <ul className="space-y-2">
        {feedback.map((item: FeedbackItem) => (
          <li key={item.id} className="border p-4 rounded">
            <p className="mb-2">{item.message}</p>
            <small className="text-gray-500">
              {new Date(item.createdAt).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.total}
        itemsPerPage={pagination.limit}
        onPageChange={handlePageChange}
      />
    </main>
  );
}
