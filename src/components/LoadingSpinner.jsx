const LoadingSpinner = ({ size = 'medium' }) => {
  const sizes = {
    small: '1rem',
    medium: '2rem',
    large: '3rem'
  };

  return (
    <div
      style={{
        width: sizes[size],
        height: sizes[size],
        border: '2px solid #e2e8f0',
        borderTop: '2px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto'
      }}
    />
  );
};

export default LoadingSpinner;