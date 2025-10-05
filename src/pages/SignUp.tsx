import { useNavigate } from 'react-router-dom';
import StackAuthForm from '../components/StackAuthForm';

export default function SignUp() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/admin');
  };

  return <StackAuthForm mode="signup" onSuccess={handleSuccess} />;
}
