import React from "react";

interface CardProps {
  header: string;
  description: string;
}

const CardComponent: React.FC<CardProps> = ({ header, description }) => {
  return (
    <div>
      <h2>
        This is My Card with {header}
        with description {description}
      </h2>
    </div>
  );
};

export default CardComponent;
