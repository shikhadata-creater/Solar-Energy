const TransparencySlider = ({ opacity, setOpacity }) => {
  return (
    <div>
      <p>Transparency: {Math.round(opacity * 100)}%</p>

      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={opacity}
        onChange={(e) => setOpacity(Number(e.target.value))}
      />
    </div>
  );
};

export default TransparencySlider;