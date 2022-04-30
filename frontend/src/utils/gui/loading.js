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
