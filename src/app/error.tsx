"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200 p-8">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="mb-6">{error.message || "An unexpected error occurred. Please try again."}</p>
      <button
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
