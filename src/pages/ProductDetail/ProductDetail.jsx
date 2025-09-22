import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Icon from "../../components/ui/Icon";
import Container from "../../components/ui/Container";
import Heading from "../../components/ui/Heading";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import ImageWithFallback from "../../components/ui/ImageWithFallback";
import Loader from "../../components/ui/Loader";
import { useCart } from "../../context/CartContext";
import { productEndpoints } from "../../api/endpoints/products.js";
import { productFeatureEndpoints } from "../../api/endpoints/productFeatures";
import { productApplicationEndpoints } from "../../api/endpoints/productApplications";
import AccessoriesSection from "../../components/ProductDetail/AccessoriesSection";
import RelatedProductsSection from "../../components/ProductDetail/RelatedProductsSection";
import clsx from "clsx";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, isInCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specifications");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [features, setFeatures] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Resetear estados cuando cambie el producto
  useEffect(() => {
    setActiveTab("specifications");
    setQuantity(1);
  }, [id]);

  // Cargar el producto desde la API
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null); // Resetear error al cambiar de producto
        setProduct(null); // Resetear producto anterior

        const response = await productEndpoints.getProductById(id);
        console.log(response);

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

  // Cargar características y aplicaciones del producto
  useEffect(() => {
    const loadProductDetails = async () => {
      if (!product?.id) return;

      try {
        setLoadingDetails(true);
        // Limpiar datos anteriores
        setFeatures([]);
        setApplications([]);

        const [featuresResponse, applicationsResponse] = await Promise.all([
          productFeatureEndpoints.getFeaturesByProduct(product.id),
          productApplicationEndpoints.getApplicationsByProduct(product.id),
        ]);

        if (featuresResponse.success) {
          setFeatures(featuresResponse.data);
        }

        if (applicationsResponse.success) {
          setApplications(applicationsResponse.data);
        }
      } catch (error) {
        console.error("Error loading product details:", error);
      } finally {
        setLoadingDetails(false);
      }
    };

    loadProductDetails();
  }, [product?.id]);

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
    dimensions,
  } = product;

  console.log(product);

  // Simplificar variables usando solo los campos que existen
  const image = main_image;
  const stock = stock_quantity;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div
      key={id}
      className="min-h-screen bg-secondary-50 dark:bg-secondary-900"
    >
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
                  {category?.name || "Sin categoría"}
                </span>
                <span className="text-sm text-secondary-500 dark:text-secondary-400 bg-primary-100 dark:bg-primary-900 px-3 py-1 rounded-full">
                  {brand?.name || "Sin marca"}
                </span>
              </div>

              {/* Product Name */}
              <Heading level={1} className="text-3xl lg:text-4xl">
                {name}
              </Heading>

              {
                /* SKU */
                <div className="flex items-center gap-2">
                  <span className="text-sm text-secondary-500 dark:text-secondary-400">
                    SKU: {product.sku || "Sin SKU"}
                  </span>
                </div>
              }

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  ${price || "0.00"}
                </span>
              </div>

              {/* Stock Status */}
              {/* <div className="flex items-center gap-2">
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
              </div> */}

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
                          Marca: ${brand?.name || "Sin marca"}
                          Categoría: ${category?.name || "Sin categoría"}
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
                          • Marca: ${brand?.name || "Sin marca"}
                          • Categoría: ${category?.name || "Sin categoría"}
                          • Precio: $${(parseFloat(price) || 0).toFixed(2)}
                          • Cantidad: ${quantity}

                          ¿Podrían enviarme más información sobre disponibilidad y condiciones de entrega?

                          Gracias.`);
                      window.open(
                        `https://wa.me/51999999999?text=${message}`,
                        "_blank"
                      );
                    }}
                    mainColor={"#16a34a"}
                    className="flex items-center justify-center gap-2 hover:bg-green-300 text-white border-green-600 hover:border-green-700"
                  >
                    <Icon name="FiMessageCircle" size="sm" />
                    Cotizar por WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Accesorios */}
          <div className="mb-8">
            <Card>
              <div className="p-6">
                <AccessoriesSection productId={product.id} />
              </div>
            </Card>
          </div>

          {/* Sección de Productos Relacionados */}
          <div className="mb-8">
            <Card>
              <div className="p-6">
                <RelatedProductsSection productId={product.id} />
              </div>
            </Card>
          </div>

          {/* Product Tabs */}
          <Card className="mb-8">
            <div className="border-b border-secondary-200 dark:border-secondary-700">
              <nav className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-8 overflow-x-auto">
                {["specifications", "features", "applications"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={clsx(
                      "py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors duration-200 whitespace-nowrap flex-shrink-0",
                      activeTab === tab
                        ? "border-primary-500 text-primary-600 dark:text-primary-400"
                        : "border-transparent text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300"
                    )}
                  >
                    {tab === "specifications" && "Especificaciones"}
                    {tab === "features" &&
                      `Características ${
                        features.length > 0 ? `(${features.length})` : ""
                      }`}
                    {tab === "applications" &&
                      `Aplicaciones ${
                        applications.length > 0
                          ? `(${applications.length})`
                          : ""
                      }`}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "specifications" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
                    Especificaciones Técnicas
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Información básica */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-secondary-800 dark:text-secondary-200">
                        Información General
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-secondary-200 dark:border-secondary-700">
                          <span className="text-secondary-600 dark:text-secondary-400">
                            Marca:
                          </span>
                          <span className="font-medium text-secondary-900 dark:text-white">
                            {brand?.name || "No especificado"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-secondary-200 dark:border-secondary-700">
                          <span className="text-secondary-600 dark:text-secondary-400">
                            Categoría:
                          </span>
                          <span className="font-medium text-secondary-900 dark:text-white">
                            {category?.name || "No especificado"}
                          </span>
                        </div>
                        {subcategory && (
                          <div className="flex justify-between items-center py-2 border-b border-secondary-200 dark:border-secondary-700">
                            <span className="text-secondary-600 dark:text-secondary-400">
                              Subcategoría:
                            </span>
                            <span className="font-medium text-secondary-900 dark:text-white">
                              {subcategory.name}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center py-2 border-b border-secondary-200 dark:border-secondary-700">
                          <span className="text-secondary-600 dark:text-secondary-400">
                            SKU:
                          </span>
                          <span className="font-medium text-secondary-900 dark:text-white font-mono">
                            {product.sku || "No especificado"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-secondary-200 dark:border-secondary-700">
                          <span className="text-secondary-600 dark:text-secondary-400">
                            SKU EC:
                          </span>
                          <span className="font-medium text-secondary-900 dark:text-white font-mono">
                            {product.sku_ec || "No especificado"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Especificaciones físicas */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-secondary-800 dark:text-secondary-200">
                        Especificaciones Físicas
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-secondary-200 dark:border-secondary-700">
                          <span className="text-secondary-600 dark:text-secondary-400">
                            Peso:
                          </span>
                          <span className="font-medium text-secondary-900 dark:text-white">
                            {weight || "No especificado"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-secondary-200 dark:border-secondary-700">
                          <span className="text-secondary-600 dark:text-secondary-400">
                            Dimensiones:
                          </span>
                          <span className="font-medium text-secondary-900 dark:text-white">
                            {dimensions || "No especificado"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-secondary-200 dark:border-secondary-700">
                          <span className="text-secondary-600 dark:text-secondary-400">
                            Stock disponible:
                          </span>
                          <span className="font-medium text-secondary-900 dark:text-white">
                            {stock} unidades
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Especificaciones técnicas */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-secondary-800 dark:text-secondary-200">
                        Especificaciones Técnicas
                      </h4>
                      <div className="space-y-3">
                        {product.potencia_kw && (
                          <div className="flex justify-between items-center py-2 border-b border-secondary-200 dark:border-secondary-700">
                            <span className="text-secondary-600 dark:text-secondary-400">
                              Potencia:
                            </span>
                            <span className="font-medium text-secondary-900 dark:text-white">
                              {product.potencia_kw} kW
                            </span>
                          </div>
                        )}
                        {product.voltaje && (
                          <div className="flex justify-between items-center py-2 border-b border-secondary-200 dark:border-secondary-700">
                            <span className="text-secondary-600 dark:text-secondary-400">
                              Voltaje:
                            </span>
                            <span className="font-medium text-secondary-900 dark:text-white">
                              {product.voltaje}
                            </span>
                          </div>
                        )}
                        {product.frame_size && (
                          <div className="flex justify-between items-center py-2 border-b border-secondary-200 dark:border-secondary-700">
                            <span className="text-secondary-600 dark:text-secondary-400">
                              Frame Size:
                            </span>
                            <span className="font-medium text-secondary-900 dark:text-white">
                              {product.frame_size}
                            </span>
                          </div>
                        )}
                        {product.corriente && (
                          <div className="flex justify-between items-center py-2 border-b border-secondary-200 dark:border-secondary-700">
                            <span className="text-secondary-600 dark:text-secondary-400">
                              Corriente:
                            </span>
                            <span className="font-medium text-secondary-900 dark:text-white">
                              {product.corriente}
                            </span>
                          </div>
                        )}
                        {product.comunicacion && (
                          <div className="flex justify-between items-center py-2 border-b border-secondary-200 dark:border-secondary-700">
                            <span className="text-secondary-600 dark:text-secondary-400">
                              Comunicación:
                            </span>
                            <span className="font-medium text-secondary-900 dark:text-white">
                              {product.comunicacion}
                            </span>
                          </div>
                        )}
                        {product.alimentacion && (
                          <div className="flex justify-between items-center py-2 border-b border-secondary-200 dark:border-secondary-700">
                            <span className="text-secondary-600 dark:text-secondary-400">
                              Alimentación:
                            </span>
                            <span className="font-medium text-secondary-900 dark:text-white">
                              {product.alimentacion}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "features" && (
                <div className="space-y-4">
                  {loadingDetails ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                      <p className="text-secondary-600 dark:text-secondary-400">
                        Cargando características...
                      </p>
                    </div>
                  ) : features.length === 0 ? (
                    <div className="text-center py-8">
                      <Icon
                        name="FiInfo"
                        className="mx-auto text-4xl text-secondary-400 mb-4"
                      />
                      <p className="text-secondary-600 dark:text-secondary-400">
                        No hay características especiales disponibles para este
                        producto.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
                        Características del Producto
                      </h3>
                      <div className="grid gap-4">
                        {features
                          .sort((a, b) => a.id - b.id)
                          .map((feature, index) => (
                            <div
                              key={feature.id}
                              className="flex items-start gap-3 p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg"
                            >
                              <div className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </div>
                              <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                                {feature.feature_text}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "applications" && (
                <div className="space-y-4">
                  {loadingDetails ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                      <p className="text-secondary-600 dark:text-secondary-400">
                        Cargando aplicaciones...
                      </p>
                    </div>
                  ) : applications.length === 0 ? (
                    <div className="text-center py-8">
                      <Icon
                        name="FiInfo"
                        className="mx-auto text-4xl text-secondary-400 mb-4"
                      />
                      <p className="text-secondary-600 dark:text-secondary-400">
                        No hay aplicaciones específicas disponibles para este
                        producto.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
                        Aplicaciones del Producto
                      </h3>
                      <div className="grid gap-4">
                        {applications
                          .sort((a, b) => a.id - b.id)
                          .map((application, index) => (
                            <div
                              key={application.id}
                              className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                            >
                              <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </div>
                              <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                                {application.application_text}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
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
