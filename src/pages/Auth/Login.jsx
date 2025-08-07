import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Icon,
  Container,
  Heading,
  Card,
  Button,
  Input,
} from "../../components/ui/components";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (value, fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        navigate("/admin");
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Error inesperado. Por favor, intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center p-4">
      <Container size="sm">
        <div className="max-w-max mx-auto ">
          <Card padding="xl">
            <div className="text-center mb-6">
              <Heading level={2} className="mb-2">
                Administración
              </Heading>
              <p className="text-secondary-600 dark:text-secondary-300">
                Ingresa tus credenciales
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={(value) => handleInputChange(value, "email")}
                placeholder="admin@aimec.com"
                required
              />

              <Input
                label="Contraseña"
                type="password"
                name="password"
                value={formData.password}
                onChange={(value) => handleInputChange(value, "password")}
                placeholder="••••••••"
                required
              />

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <span className="text-red-700 dark:text-red-300 text-sm">
                    {error}
                  </span>
                </div>
              )}

              <Button
                type="submit"
                fullWidth
                disabled={isLoading}
                loading={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-secondary-200 dark:border-secondary-700 text-center">
              <Link
                to="/"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm"
              >
                Volver al sitio principal
              </Link>
            </div>

            <div className="mt-4 p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg text-xs text-secondary-600 dark:text-secondary-400">
              <div>
                <strong>Email:</strong> admin@aimec.com
              </div>
              <div>
                <strong>Contraseña:</strong> admin123
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default Login;
