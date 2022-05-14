//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

import { useReducer } from "react";
import { ReactComponent as StarIcon } from "./star.svg";

const FavouriteLocation = (props) => {
  const [showFavourite, toggleShowFavourite] = useReducer(
    (bool) => !bool,
    false
  );

  const handleClick = () => {
    toggleShowFavourite();
    props.onClick();
  };
  return (
    <div style={{ cursor: "pointer" }}>
      {showFavourite ? (
        <StarIcon
          data-toggle="tooltip"
          title="Show Normal"
          onClick={handleClick}
          style={{ color: "#F6BE00", width: "30", height: "30" }}
        />
      ) : (
        <StarIcon
          data-toggle="tooltip"
          title="Show Favourite Locations"
          onClick={handleClick}
          style={{ color: "#777", width: "30", height: "30" }}
        />
      )}
    </div>
  );
};

export { FavouriteLocation };
