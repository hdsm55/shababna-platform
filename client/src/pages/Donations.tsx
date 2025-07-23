import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Donations = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/blogs', { replace: true });
  }, [navigate]);
  return null;
};

export default Donations;
