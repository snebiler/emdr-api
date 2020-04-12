const hours = (millisec) => {
  return (millisec / (1000 * 60 * 60)).toFixed(1);
};

module.exports = hours;