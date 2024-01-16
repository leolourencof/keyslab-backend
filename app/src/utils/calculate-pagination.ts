export function calculatePagination(
  count: number,
  limit: number,
  page: number,
) {
  const totalPages = Math.ceil(count / limit);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  return { totalPages, hasPreviousPage, hasNextPage };
}
