//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

import "./sunny_rain.css";

const LoadingAnimation = () => {
  return (
    <div>
      <span className="rain-loader" />
      <span className="sun-loader" />
    </div>
  );
};
const FullScreenLoading = () => {
  return <LoadingAnimation />;
};

export { FullScreenLoading };
