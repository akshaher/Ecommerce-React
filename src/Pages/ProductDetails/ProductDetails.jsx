import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import Header from "../../components/layout/Header.jsx"
import {  useQuery } from "@tanstack/react-query";
import { fetchEvent } from "../../util/http.js";
import ProductDetail from "../../components/Product/ProductDetail.jsx";
import CartIcon from "../../components/cart/CartIcon.jsx";
import LoadingIndicator from "../../components/UI/LoadingIndicator.jsx";
import ErrorBlock from "../../components/UI/ErrorBlock.jsx"

export default function ProductDetails() {

  const { id } = useParams();
  const navigate=useNavigate();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["product", { id: id }],
    queryFn: () => fetchEvent({ id }),
  });

  function navigateToLogin() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  let content;


  if (isPending){
   content= <div className="plp-state">
    <LoadingIndicator/>
   </div>
  }

  if(isError && error.code === 401){    
    content=(
      <div className="error-box auth-error">
        <h2 className="error-title">Session Expired</h2>
        <p className="error-message">{error.message}</p>
        <a onClick={navigateToLogin} className="error-link">Click here to login again</a>
      </div>
    )}else if (isError){
      content = (
        <div className="plp-state">
          <ErrorBlock title="An error occured"
          message={error.message || "Failed to Fetch"}
          />
        </div>
      )
    } 

    if(data){
      content = <ProductDetail data={data}/>
    }
  


  return (
    <>
      <Header>
        <Link to="/products" className="button">
          View all Products
        </Link>
        <CartIcon />
      </Header>

      {/* <ProductDetail data={data} /> */}
      {content}
    </>
  );
}
