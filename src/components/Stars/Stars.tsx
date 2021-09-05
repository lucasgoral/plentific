import React from "react";

interface Props {
  rating: number;
}
const maxStars = 5;

export const Stars: React.FC<Props> = ({ rating }) => {
  const rounded = Math.round(rating);
  const stars = Array(maxStars)
    .fill(null)
    .map((el, index) => (index < rounded ? "\u2605" : "\u2606"));
  return <span>{stars.map((i) => i)}</span>;
};
