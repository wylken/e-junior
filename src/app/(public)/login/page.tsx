import { LoginForm } from '@/components/forms/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Template Base
          </h1>
          <p className="text-gray-600">
            Bem-vindo de volta!
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}