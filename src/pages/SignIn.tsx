import { useNavigate } from 'react-router-dom';
import StackAuthForm from '../components/StackAuthForm';

export default function SignIn() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/admin');
  };

  return <StackAuthForm mode="signin" onSuccess={handleSuccess} />;
}
