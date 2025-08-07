import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Icon, 
  Container, 
  Heading, 
  Card, 
  Button, 
  Input,
  ImageWithFallback
} from '../../components/ui/components';
import { useCart } from '../../context/CartContext';
import clsx from 'clsx';

const Quotation = () => {
  const { items, total, itemCount, removeFromCart, updateQuantity, clearCart } = useCart();
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleSubmitQuotation = () => {
    // Aquí se enviaría la cotización
    console.log('Enviando cotización:', {
      customerInfo,
      items,
      total
    });
    alert('Cotización enviada exitosamente');
  };

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
        <Container>
          <div className="py-16 text-center">
            <div className="text-secondary-400 dark:text-secondary-500 text-8xl mb-6">
              🛒
            </div>
            <Heading level={1} className="mb-4">
              Tu cotización está vacía
            </Heading>
            <p className="text-secondary-600 dark:text-secondary-300 mb-8 max-w-md mx-auto">
              Agrega productos desde nuestro catálogo para crear una cotización personalizada
            </p>
            <Button as={Link} to="/catalogo" size="lg">
              <Icon name="FiShoppingBag" className="mr-2" />
              Explorar Catálogo
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <Container>
        <div className="py-8">
          {/* Header */}
          <div className="mb-8">
            <Heading level={1} className="mb-2">
              Cotización
            </Heading>
            <p className="text-secondary-600 dark:text-secondary-300">
              Revisa y personaliza tu cotización antes de enviarla
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2">
              <Card padding="lg" className="mb-6">
                <div className="flex justify-between items-center mb-6">
                  <Heading level={3}>
                    Productos ({itemCount})
                  </Heading>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Icon name="FiTrash2" size="sm" className="mr-2" />
                    Vaciar Cotización
                  </Button>
                </div>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg"
                    >
                      {/* Imagen del producto */}
                      <div className="w-20 h-20 flex-shrink-0">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      {/* Información del producto */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-secondary-900 dark:text-white mb-1 line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-sm text-secondary-600 dark:text-secondary-300 mb-2 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-secondary-500 dark:text-secondary-400">
                            {item.brand}
                          </span>
                          <span className="text-sm text-secondary-500 dark:text-secondary-400">
                            {item.category}
                          </span>
                        </div>
                      </div>

                      {/* Cantidad */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="w-8 h-8 p-0"
                        >
                          -
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-8 h-8 p-0"
                        >
                          +
                        </Button>
                      </div>

                      {/* Precio */}
                      <div className="text-right min-w-[100px]">
                        <div className="font-semibold text-secondary-900 dark:text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-sm text-secondary-500 dark:text-secondary-400">
                          ${item.price.toFixed(2)} c/u
                        </div>
                      </div>

                      {/* Botón eliminar */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Icon name="FiX" size="sm" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Formulario de contacto y resumen */}
            <div className="space-y-6">
              {/* Resumen */}
              <Card padding="lg">
                <Heading level={3} className="mb-4">
                  Resumen de Cotización
                </Heading>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-secondary-600 dark:text-secondary-300">
                      Productos ({itemCount})
                    </span>
                    <span className="font-medium">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-secondary-200 dark:border-secondary-700 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Estimado</span>
                      <span className="text-primary-600 dark:text-primary-400">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                      * Los precios son estimados y pueden variar
                    </p>
                  </div>
                </div>
              </Card>

              {/* Formulario de contacto */}
              <Card padding="lg">
                <Heading level={3} className="mb-4">
                  Información de Contacto
                </Heading>
                <div className="space-y-4">
                  <Input
                    label="Nombre completo"
                    value={customerInfo.name}
                    onChange={(value) => setCustomerInfo({...customerInfo, name: value})}
                    placeholder="Tu nombre completo"
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(value) => setCustomerInfo({...customerInfo, email: value})}
                    placeholder="tu@email.com"
                  />
                  <Input
                    label="Teléfono"
                    value={customerInfo.phone}
                    onChange={(value) => setCustomerInfo({...customerInfo, phone: value})}
                    placeholder="+1 234 567 8900"
                  />
                  <Input
                    label="Empresa"
                    value={customerInfo.company}
                    onChange={(value) => setCustomerInfo({...customerInfo, company: value})}
                    placeholder="Nombre de tu empresa"
                  />
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Mensaje adicional
                    </label>
                    <textarea
                      value={customerInfo.message}
                      onChange={(e) => setCustomerInfo({...customerInfo, message: e.target.value})}
                      placeholder="Comentarios o requisitos especiales..."
                      className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white resize-none"
                      rows={4}
                    />
                  </div>
                </div>
              </Card>

              {/* Botones de acción */}
              <div className="space-y-3">
                <Button
                  onClick={handleSubmitQuotation}
                  fullWidth
                  size="lg"
                  disabled={!customerInfo.name || !customerInfo.email}
                >
                  <Icon name="FiSend" className="mr-2" />
                  Enviar Cotización
                </Button>
                <Button
                  as={Link}
                  to="/catalogo"
                  variant="outline"
                  fullWidth
                >
                  <Icon name="FiPlus" className="mr-2" />
                  Agregar Más Productos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Quotation; 