import "./IconAnimation.css";

const IconAnimation = () => {
  return (
    <>
      <div className="w-36 h-36 relative flex justify-center zoom-in-component">
        <svg
          className="absolute top-2 left-1/2 transform -translate-x-1/2"
          width="75"
          height="200"
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
        <div className="icon-container absolute top-4 left-1/2 transform -translate-x-1/2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-24 icon rotating-icon"
          >
            <path
              fillRule="evenodd"
              d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="circle absolute top-12 left-1/2 transform -translate-x-1/2"></div>
      </div>
    </>
  );
};

export default IconAnimation;
