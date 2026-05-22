import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();
export async function fetchEvents({ searchTerm, category,page }) {
  const url = new URL("http://localhost:5000/products");

  if (searchTerm) {
    url.searchParams.append("search", searchTerm);
  } else if (category && category !== "all") {
    url.searchParams.append("category", category);
  }
  

  if(page){
  url.searchParams.append("page", page);
  url.searchParams.append("limit", 5);
  }
  
  const token = localStorage.getItem("token");

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  // ✅ Handle authentication errors separately
  if (response.status === 401) {
    const error = new Error("SESSION_EXPIRED");
    error.code = 401;
    error.message = "Your session has expired. Please login again.";
    error.redirectTo = "/login";
    throw error;
  }

  // ✅ Other errors
  if (!response.ok) {
    const error = new Error("FETCH_ERROR");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const data = await response.json();
  return data;
}



export async function fetchEvent({ id, signal }) {
  const token = localStorage.getItem("token");
  let url= "http://localhost:5000/products/";

  const response = await fetch(url+ `${id}`, { signal ,headers: {
      Authorization: token ? `Bearer ${token}` : "",
    } });

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the product');
    error.code = response.status;
    error.message = `No Product has been found with ID: ${id}`;
    error.info = await response.json();
    
    throw error;
  }

  const { product } = await response.json();

  return product;
}

