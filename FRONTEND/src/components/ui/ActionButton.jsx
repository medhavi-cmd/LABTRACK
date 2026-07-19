function ActionButton({
  text,
  color = "cyan",
  onClick,
}) {
  const styles = {
    cyan: "bg-[#2563EB] hover:bg-[#1d4ed8]",
    green: "bg-green-600 hover:bg-green-700",
    red: "bg-red-600 hover:bg-red-700",
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