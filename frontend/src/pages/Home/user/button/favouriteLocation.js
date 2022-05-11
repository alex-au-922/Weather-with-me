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
          style={{ color: "#fff" }}
        />
      ) : (
        <StarIcon
          data-toggle="tooltip"
          title="Show Favourite Locations"
          onClick={handleClick}
          style={{ color: "#777" }}
        />
      )}
    </div>
  );
};

export { FavouriteLocation };
