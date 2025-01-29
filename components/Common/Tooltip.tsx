import React, { ReactNode } from "react";
import { PlacesType, Tooltip, VariantType } from "react-tooltip";

const CustomTooltip = ({
  id = "tooltip",
  content = "This is a tooltip",
  variant = "light",
  className = "",
  place = "top",
  onClick = () => {},
  children,
}: {
  id?: string;
  content?: string;
  variant?: VariantType | undefined;
  className?: string;
  place?: PlacesType | undefined;
  onClick?: () => void;
  children: ReactNode | string;
}) => {
  return (
    <button
      data-tooltip-id={id}
      data-tooltip-content={content}
      data-tooltip-variant={variant}
      data-tooltip-class-name={`${className} react-tooltip`}
      data-tooltip-place={place}
      id="select-slot"
      type="button"
      onClick={onClick}
    >
      {children}
      <Tooltip id={id} />
    </button>
  );
};

export default CustomTooltip;
