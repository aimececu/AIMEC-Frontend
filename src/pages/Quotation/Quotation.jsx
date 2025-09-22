import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../../components/ui/Icon";
import Container from "../../components/ui/Container";
import Heading from "../../components/ui/Heading";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import ImageWithFallback from "../../components/ui/ImageWithFallback";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import quotationService from "../../services/quotationService";
import clsx from "clsx";

const Quotation = () => {
  const { items, total, itemCount, removeFromCart, updateQuantity, clearCart } =
    useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleSubmitQuotation = async () => {
    // Validar que hay items en el carrito
    if (!items || items.length === 0) {
      showToast("No hay productos en la cotización", "error");
      return;
    }

    // Validar datos del cliente
    const validation = quotationService.validateQuotationData({
      customerInfo,
      items,
      total,
    });

    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      showToast(firstError, "error");
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar datos de la cotización
      const quotationData = {
        customerInfo,
        items: items.map((item) => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price,
        })),
        total,
        notes: customerInfo.message,
      };

      // Enviar cotización
      const result = await quotationService.sendQuotation(quotationData);

      if (result.success) {
        showToast(result.message, "success");

        // Limpiar carrito y formulario
        clearCart();
        setCustomerInfo({
          name: "",
          email: "",
          phone: "",
          company: "",
          message: "",
        });

        // Redirigir a la página principal
        navigate("/");
      }
    } catch (error) {
      showToast(error.message, "error");
      console.error("Error enviando cotización:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
        <Container>
          <div className="py-8 lg:py-16 text-center px-4">
            <div className="text-secondary-400 dark:text-secondary-500 text-6xl lg:text-8xl mb-4 lg:mb-6">
              🛒
            </div>
            <Heading level={1} className="mb-3 lg:mb-4 text-2xl lg:text-3xl">
              Tu cotización está vacía
            </Heading>
            <p className="text-secondary-600 dark:text-secondary-300 mb-6 lg:mb-8 max-w-md mx-auto text-sm lg:text-base">
              Agrega productos desde nuestro catálogo para crear una cotización
              personalizada
            </p>
            <Button
              size="md lg:lg"
              onClick={() => navigate("/productos")}
              className="text-sm lg:text-base"
            >
              <Icon name="FiShoppingBag" className="mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Explorar Catálogo</span>
              <span className="sm:hidden">Explorar</span>
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <Container>
        <div className="py-4 lg:py-8 px-4 lg:px-0">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <Heading level={1} className="mb-2 text-xl lg:text-3xl">
              Cotización
            </Heading>
            <p className="text-secondary-600 dark:text-secondary-300 text-sm lg:text-base">
              Revisa y personaliza tu cotización antes de enviarla
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2">
              <Card padding="lg" className="mb-4 lg:mb-6">
                <div className="flex justify-between items-center mb-4 lg:mb-6">
                  <Heading level={3} className="text-lg lg:text-xl">
                    Productos ({itemCount})
                  </Heading>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    <Icon name="FiTrash2" size="sm" className="mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Vaciar Cotización</span>
                    <span className="sm:hidden">Vaciar</span>
                  </Button>
                </div>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-4 shadow-sm"
                    >
                      {/* Header del producto */}
                      <div className="mb-3">
                        {/* Imagen y badges en la misma línea */}
                        <div className="flex items-center gap-3 mb-3">
                          {/* Imagen del producto */}
                          <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                            <ImageWithFallback
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>

                          {/* Brand y Category badges */}
                          <div className="flex flex-col gap-2 flex-1">
                            <div className="flex flex-wrap gap-2">
                              <span className="text-xs bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 px-2 py-1 rounded-full">
                                {typeof item.brand === "object"
                                  ? item.brand?.name || "Sin marca"
                                  : item.brand || "Sin marca"}
                              </span>
                              <span className="text-xs bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 px-2 py-1 rounded-full">
                                {typeof item.category === "object"
                                  ? item.category?.name || "Sin categoría"
                                  : item.category || "Sin categoría"}
                              </span>
                            </div>
                          </div>

                          {/* Botón eliminar */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 flex-shrink-0"
                          >
                            <Icon name="FiX" size="sm" />
                          </Button>
                        </div>

                        {/* Nombre del producto ocupando todo el ancho */}
                        <h4 className="font-semibold text-secondary-900 dark:text-white text-base sm:text-lg">
                          {item.name}
                        </h4>
                      </div>

                      {/* Footer con controles y precio */}
                      <div className="flex items-center justify-between pt-3 border-t border-secondary-100 dark:border-secondary-700">
                        {/* Controles de cantidad */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            className="w-8 h-8 p-0 rounded-full"
                          >
                            -
                          </Button>
                          <span className="w-8 text-center font-medium text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 p-0 rounded-full"
                          >
                            +
                          </Button>
                        </div>

                        {/* Precio */}
                        <div className="text-right">
                          <div className="font-bold text-lg text-secondary-900 dark:text-white">
                            $
                            {(
                              parseFloat(item.price || 0) * item.quantity
                            ).toFixed(2)}
                          </div>
                          <div className="text-sm text-secondary-500 dark:text-secondary-400">
                            ${parseFloat(item.price || 0).toFixed(2)} c/u
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Formulario de contacto y resumen */}
            <div className="space-y-4 lg:space-y-6">
              {/* Resumen */}
              <Card
                padding="lg"
                className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-700"
              >
                <Heading level={3} className="mb-4 text-lg font-semibold">
                  Resumen de Cotización
                </Heading>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-secondary-600 dark:text-secondary-300 font-medium">
                      Productos ({itemCount})
                    </span>
                    <span className="font-semibold text-secondary-900 dark:text-white">
                      ${parseFloat(total || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-primary-200 dark:border-primary-700 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-secondary-900 dark:text-white">
                        Total Estimado
                      </span>
                      <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        ${parseFloat(total || 0).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-2 text-center">
                      * Los precios son estimados y pueden variar
                    </p>
                  </div>
                </div>
              </Card>

              {/* Formulario de contacto */}
              <Card padding="lg">
                <Heading level={3} className="mb-4 text-lg">
                  Información de Contacto
                </Heading>
                <div className="space-y-4">
                  <Input
                    label="Nombre completo"
                    value={customerInfo.name}
                    onChange={(value) =>
                      setCustomerInfo({ ...customerInfo, name: value })
                    }
                    placeholder="Tu nombre completo"
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(value) =>
                      setCustomerInfo({ ...customerInfo, email: value })
                    }
                    placeholder="tu@email.com"
                  />
                  <Input
                    label="Teléfono"
                    value={customerInfo.phone}
                    onChange={(value) =>
                      setCustomerInfo({ ...customerInfo, phone: value })
                    }
                    placeholder="+1 234 567 8900"
                  />
                  <Input
                    label="Empresa"
                    value={customerInfo.company}
                    onChange={(value) =>
                      setCustomerInfo({ ...customerInfo, company: value })
                    }
                    placeholder="Nombre de tu empresa"
                  />
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Mensaje adicional
                    </label>
                    <textarea
                      value={customerInfo.message}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          message: e.target.value,
                        })
                      }
                      placeholder="Comentarios o requisitos especiales..."
                      className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white resize-none text-sm"
                      rows={3}
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
                  loading={isSubmitting}
                  disabled={
                    !customerInfo.name || !customerInfo.email || isSubmitting
                  }
                  icon={
                    !isSubmitting ? (
                      <Icon name="FiSend" className="mr-2" />
                    ) : null
                  }
                  className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isSubmitting ? "Enviando..." : "Enviar Cotización"}
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  size="lg"
                  onClick={() => navigate("/productos")}
                  className="border-2 border-primary-200 hover:border-primary-300 text-primary-700 hover:text-primary-800 font-semibold py-3 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200"
                >
                  <Icon name="FiPlus" className="mr-2" />
                  <span className="hidden sm:inline">
                    Agregar Más Productos
                  </span>
                  <span className="sm:hidden">Agregar Productos</span>
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
