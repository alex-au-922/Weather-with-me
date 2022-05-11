import { ReactComponent as RefreshIcon } from "./repeat.svg";

const RefreshWeather = (props) => {
  return (
    <>
      <RefreshIcon onClick={props.onClick} />
    </>
  );
};

export { RefreshWeather };
