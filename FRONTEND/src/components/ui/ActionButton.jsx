function ActionButton({
  text,
  color = "cyan",
  onClick,
}) {
  const styles = {
    cyan: "bg-[#2563EB] hover:bg-[#1d4ed8]",
    green: "bg-[#10b981] hover:bg-[#059669]",
    red: "bg-[#ef4444] hover:bg-[#dc2626]",
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