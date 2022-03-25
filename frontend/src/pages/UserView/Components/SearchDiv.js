import React, { useState } from "react";
import searchLogo from "../../../logos/search.png";
import Collapse from "react-bootstrap/Collapse";
export default function SearchDiv({ handleSearch, query }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  function toggleSearch() {
    setIsSearchOpen(!isSearchOpen);
  }
  return (
    <div className="d-flex mt-2">
      <img onClick={toggleSearch} src={searchLogo} width={40} height={40} />
      <Collapse in={isSearchOpen} dimension="width">
        <div>
          <input
            onChange={handleSearch}
            className="input-group- p-2 bg-light rounded"
          />
        </div>
      </Collapse>
    </div>
  );
}
