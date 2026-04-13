interface StarRatingProps {
  rating: number
}

const StarRating = ({ rating }: StarRatingProps) => {
  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className="material-symbols-outlined"
          style={{ fontSize: '18px', color: i < Math.round(rating) ? '#FCB136' : '#D1D5DB' }}
        >
          star
        </span>
      ))}
    </div>
  )
}

export default StarRating