const Icon = ({ iconCode }) => {
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  return (
    <>{iconCode ? <img src={iconUrl} alt="current weather icon" /> : ""}</>
  );
};

export default Icon;
