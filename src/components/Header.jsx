import { useIsFetching } from "@tanstack/react-query";

export default function Header({ children }) {
const fetching=useIsFetching();
console.log(fetching);


  return (
    <>
      {/* <div id="main-header-loading">
        {fetching >0 && <progress/>}
      </div> */}
      <header id="main-header">
        <div id="header-title">
        </div>
        <nav>{children}</nav>
      </header>
    </>
  );
}
