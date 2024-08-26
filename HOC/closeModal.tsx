import { useEffect, useRef } from "react";

const withOutsideClick = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  handleOutsideClick: () => void
) => {
  const ComponentWithOutsideClick = (props: P) => {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(event.target as Node)
        ) {
          handleOutsideClick();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
      <div ref={wrapperRef}>
        <WrappedComponent {...props} />
      </div>
    );
  };

  return ComponentWithOutsideClick;
};

export default withOutsideClick;
