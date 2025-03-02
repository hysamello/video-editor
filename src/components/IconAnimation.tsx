import "./IconAnimation.css";

const IconAnimation = () => {
  return (
    <div
      style={{
        width: "50px",
        height: "50px",
        position: "relative",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <svg
        style={{
          position: "absolute",
          top: "5px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "75px",
          height: "200px",
        }}
        viewBox="0 0 200 100"
      >
        <ellipse
          cx="100"
          cy="50"
          rx="90"
          ry="40"
          className="animated-ellipse"
        />
      </svg>

      <div
        style={{
          position: "absolute",
          top: "4px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="icon rotating-icon"
          style={{ width: "30px", height: "30px", color: "black" }}
        >
          <path
            fillRule="evenodd"
            d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <div
        className="circle"
        style={{
          position: "absolute",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
    </div>
  );
};

export default IconAnimation;
