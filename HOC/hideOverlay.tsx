import React, { useEffect, useRef, ComponentType } from "react";

const hideOverlay = <P extends object>(
  Component: ComponentType<P>,
  setShowSchedule: (a: boolean) => void
) => {
  const WrappedComponent: React.FC<P> = (props) => {
    const sidebarRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setShowSchedule(false);
      }
    };

    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
      <div ref={sidebarRef}>
        <Component {...(props as P)} />
      </div>
    );
  };

  return WrappedComponent;
};

export default hideOverlay;
