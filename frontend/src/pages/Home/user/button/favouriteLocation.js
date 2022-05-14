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
