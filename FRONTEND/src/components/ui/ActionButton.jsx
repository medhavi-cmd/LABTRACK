function ActionButton({
  text,
  color = "cyan",
  onClick,
}) {
  const styles = {
    cyan: "bg-cyan-500 hover:bg-cyan-600",
    green: "bg-green-500 hover:bg-green-600",
    red: "bg-red-500 hover:bg-red-600",
  };

  return (
    <button
      onClick={onClick}
      className={`${styles[color]} px-4 py-2 rounded-lg text-white text-sm font-medium transition`}
    >
      {text}
    </button>
  );
}

export default ActionButton;