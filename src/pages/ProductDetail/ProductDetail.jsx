import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Icon from "../../components/ui/Icon";
import Container from "../../components/ui/Container";
import Heading from "../../components/ui/Heading";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import ProductCard from "../../components/ui/ProductCard";
import ImageWithFallback from "../../components/ui/ImageWithFallback";
import Loader from "../../components/ui/Loader";
import { useCart } from "../../context/CartContext";
import { productEndpoints } from "../../api/endpoints/products.js";
import clsx from "clsx";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, isInCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar el producto desde la API
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const response = await productEndpoints.getProductById(id);
        if (response.success) {
          setProduct(response.data);
        } else {
          setError("Producto no encontrado");
        }
      } catch (error) {
        console.error("Error cargando producto:", error);
        setError("Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
        <Container>
          <div className="py-16 text-center">
            <Loader
              size="xl"
              variant="spinner"
              text="Cargando producto..."
              className="mb-6"
            />
            <p className="text-secondary-600 dark:text-secondary-300">
              Obteniendo información del producto...
            </p>
          </div>
        </Container>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
        <Container>
          <div className="py-16 text-center">
            <div className="text-secondary-400 dark:text-secondary-500 text-8xl mb-6">
              🔍
            </div>
            <Heading level={1} className="mb-4">
              Producto no encontrado
            </Heading>
            <p className="text-secondary-600 dark:text-secondary-300 mb-8">
              {error || "El producto que buscas no existe o ha sido removido"}
            </p>
            <Button as={Link} to="/productos">
              <Icon name="FiArrowLeft" className="mr-2" />
              Volver a Productos
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  const {
    name,
    description,
    price,
    main_image,
    stock_quantity,
    brand,
    category,
    subcategory,
    weight,
    dimensions
  } = product;

  // Valores por defecto para campos que no existen en el backend
  const originalPrice = null; // No existe en el modelo
  const image = main_image;
  const stock = stock_quantity;
  const series = null; // No existe en el modelo
  const specifications = {}; // No existe en el modelo
  const features = []; // No existe en el modelo
  const applications = []; // No existe en el modelo
  const certifications = []; // No existe en el modelo
  const warranty = null; // No existe en el modelo
  const leadTime = null; // No existe en el modelo


  const handleAddToCart = () => {
    addToCart(product, quantity);
  };



  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <Container>
        <div className="py-8">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-secondary-600 dark:text-secondary-400">
              <li>
                <Link
                  to="/"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Icon name="FiChevronRight" size="sm" />
              </li>
              <li>
                <Link
                  to="/productos"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Productos
                </Link>
              </li>
              <li>
                <Icon name="FiChevronRight" size="sm" />
              </li>
              <li className="text-secondary-900 dark:text-white font-medium">
                {name}
              </li>
            </ol>
          </nav>

          {/* Product Main Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square bg-white dark:bg-secondary-800 rounded-lg overflow-hidden shadow-lg">
                <ImageWithFallback
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Category and Brand */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-500 dark:text-secondary-400 bg-secondary-100 dark:bg-secondary-700 px-3 py-1 rounded-full">
                  {category?.name || 'Sin categoría'}
                </span>
                {series && (
                  <span className="text-sm text-secondary-500 dark:text-secondary-400 bg-primary-100 dark:bg-primary-900 px-3 py-1 rounded-full">
                    {series}
                  </span>
                )}
                <span className="text-sm text-secondary-500 dark:text-secondary-400">
                  {brand?.name || 'Sin marca'}
                </span>
              </div>

              {/* Product Name */}
              <Heading level={1} className="text-3xl lg:text-4xl">
                {name}
              </Heading>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  ${(parseFloat(price) || 0).toFixed(2)}
                </span>
                {originalPrice && parseFloat(originalPrice) > parseFloat(price) && (
                  <span className="text-xl text-secondary-400 line-through">
                    ${parseFloat(originalPrice).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <span
                  className={clsx(
                    "text-sm px-3 py-1 rounded-full",
                    stock > 10
                      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                      : stock > 0
                      ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                      : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                  )}
                >
                  {stock > 0 ? `${stock} unidades en stock` : "Sin stock"}
                </span>
                {leadTime && (
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">
                    Tiempo de entrega: {leadTime}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-secondary-600 dark:text-secondary-300 text-lg leading-relaxed">
                {description}
              </p>

              {/* Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-secondary-300 dark:border-secondary-600 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white"
                    >
                      <Icon name="FiMinus" size="sm" />
                    </button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(value) =>
                        setQuantity(Math.max(1, parseInt(value) || 1))
                      }
                      className="w-20 text-center border-0"
                      min="1"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white"
                    >
                      <Icon name="FiPlus" size="sm" />
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  fullWidth
                  size="lg"
                  disabled={stock === 0}
                  className={clsx(
                    isInCart(product.id) && "bg-green-600 hover:bg-green-700"
                  )}
                >
                  <Icon
                    name={isInCart(product.id) ? "FiCheck" : "FiShoppingCart"}
                    className="mr-2"
                  />
                  {isInCart(product.id)
                    ? "Agregado a Cotización"
                    : "Agregar a Cotización"}
                </Button>

                {/* Cotización Directa */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      const subject = encodeURIComponent(`Cotización: ${name}`);
                      const body =
                        encodeURIComponent(`Hola, me interesa cotizar el siguiente producto:
                          Producto: ${name}
                          Marca: ${brand?.name || 'Sin marca'}
                          Categoría: ${category?.name || 'Sin categoría'}
                          ${series ? `Serie: ${series}` : ""}
                          Precio: $${(parseFloat(price) || 0).toFixed(2)}
                          Cantidad: ${quantity}

                          Por favor, envíenme más información sobre disponibilidad y condiciones de entrega.

                          Saludos cordiales.`);
                      window.open(
                        `mailto:ventas@aimec.com?subject=${subject}&body=${body}`,
                        "_blank"
                      );
                    }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Icon name="FiMail" size="sm" />
                    Cotizar por Email
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      const message =
                        encodeURIComponent(`Hola, me interesa cotizar el siguiente producto:
                          *${name}*
                          • Marca: ${brand?.name || 'Sin marca'}
                          • Categoría: ${category?.name || 'Sin categoría'}
                          ${series ? `• Serie: ${series}` : ""}
                          • Precio: $${(parseFloat(price) || 0).toFixed(2)}
                          • Cantidad: ${quantity}

                          ¿Podrían enviarme más información sobre disponibilidad y condiciones de entrega?

                          Gracias.`);
                      window.open(
                        `https://wa.me/51999999999?text=${message}`,
                        "_blank"
                      );
                    }}
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700"
                  >
                    <Icon name="FiMessageCircle" size="sm" />
                    Cotizar por WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <Card className="mb-8">
            <div className="border-b border-secondary-200 dark:border-secondary-700">
              <nav className="flex space-x-8">
                {[
                  "description",
                  "specifications",
                  "features",
                  "applications",
                ].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={clsx(
                      "py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200",
                      activeTab === tab
                        ? "border-primary-500 text-primary-600 dark:text-primary-400"
                        : "border-transparent text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300"
                    )}
                  >
                    {tab === "description" && "Descripción"}
                    {tab === "specifications" && "Especificaciones"}
                    {tab === "features" && "Características"}
                    {tab === "applications" && "Aplicaciones"}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "description" && (
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-secondary-600 dark:text-secondary-300 leading-relaxed">
                    {description}
                  </p>
                </div>
              )}

              {activeTab === "specifications" && (
                <div className="text-center py-8">
                  <Icon name="FiInfo" className="mx-auto text-4xl text-secondary-400 mb-4" />
                  <p className="text-secondary-600 dark:text-secondary-400">
                    No hay especificaciones técnicas disponibles para este producto.
                  </p>
                </div>
              )}

              {activeTab === "features" && (
                <div className="text-center py-8">
                  <Icon name="FiInfo" className="mx-auto text-4xl text-secondary-400 mb-4" />
                  <p className="text-secondary-600 dark:text-secondary-400">
                    No hay características especiales disponibles para este producto.
                  </p>
                </div>
              )}

              {activeTab === "applications" && (
                <div className="text-center py-8">
                  <Icon name="FiInfo" className="mx-auto text-4xl text-secondary-400 mb-4" />
                  <p className="text-secondary-600 dark:text-secondary-400">
                    No hay aplicaciones específicas disponibles para este producto.
                  </p>
                </div>
              )}
            </div>
          </Card>


        </div>
      </Container>
    </div>
  );
};

export default ProductDetail;
