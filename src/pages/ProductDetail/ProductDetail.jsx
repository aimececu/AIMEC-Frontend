import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Icon,
  Container,
  Heading,
  Card,
  Button,
  Input,
  ProductCard,
  ImageWithFallback,
  Loader
} from "../../components/ui/components";
import { useCart } from "../../context/CartContext";
import { productEndpoints } from "../../api/endpoints/products.js";
import { transformProduct } from "../../services/dataTransform.js";
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
          setProduct(transformProduct(response.data));
        } else {
          setError('Producto no encontrado');
        }
      } catch (error) {
        console.error('Error cargando producto:', error);
        setError('Error al cargar el producto');
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
              {error || 'El producto que buscas no existe o ha sido removido'}
            </p>
            <Button as={Link} to="/catalogo">
              <Icon name="FiArrowLeft" className="mr-2" />
              Volver al Catálogo
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
    originalPrice,
    image,
    rating,
    category,
    brand,
    series,
    stock,
    specifications,
    accessories,
    relatedProducts,
    features,
    applications,
    certifications,
    warranty,
    leadTime
  } = product;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon key={i} name="FiStar" size="sm" className="text-yellow-400 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Icon key="half" name="FiStar" size="sm" className="text-yellow-400 fill-current" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon key={`empty-${i}`} name="FiStar" size="sm" className="text-secondary-300" />
      );
    }

    return stars;
  };

  // Obtener productos relacionados
  const getRelatedProducts = () => {
    if (!relatedProducts) return [];
    // Por ahora retornamos un array vacío ya que necesitaríamos un endpoint específico
    // para productos relacionados o cargar todos los productos
    return [];
  };

  const relatedProductsList = getRelatedProducts();

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <Container>
        <div className="py-8">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-secondary-600 dark:text-secondary-400">
              <li>
                <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400">
                  Inicio
                </Link>
              </li>
              <li>
                <Icon name="FiChevronRight" size="sm" />
              </li>
              <li>
                <Link to="/catalogo" className="hover:text-primary-600 dark:hover:text-primary-400">
                  Catálogo
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
                  {category}
                </span>
                {series && (
                  <span className="text-sm text-secondary-500 dark:text-secondary-400 bg-primary-100 dark:bg-primary-900 px-3 py-1 rounded-full">
                    {series}
                  </span>
                )}
                <span className="text-sm text-secondary-500 dark:text-secondary-400">
                  {brand}
                </span>
              </div>

              {/* Product Name */}
              <Heading level={1} className="text-3xl lg:text-4xl">
                {name}
              </Heading>

              {/* Rating */}
              {rating && (
                <div className="flex items-center gap-2">
                  {renderStars(rating)}
                  <span className="text-secondary-600 dark:text-secondary-300">
                    ({rating})
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  ${price.toFixed(2)}
                </span>
                {originalPrice && originalPrice > price && (
                  <span className="text-xl text-secondary-400 line-through">
                    ${originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <span className={clsx(
                  "text-sm px-3 py-1 rounded-full",
                  stock > 10 
                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                    : stock > 0
                    ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                    : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                )}>
                  {stock > 0 ? `${stock} unidades en stock` : 'Sin stock'}
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
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
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
                  {isInCart(product.id) ? "Agregado a Cotización" : "Agregar a Cotización"}
                </Button>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                {warranty && (
                  <div className="text-center">
                    <Icon name="FiShield" className="mx-auto mb-1 text-primary-600" />
                    <div className="text-sm font-medium">Garantía</div>
                    <div className="text-xs text-secondary-600 dark:text-secondary-400">{warranty}</div>
                  </div>
                )}
                {certifications && certifications.length > 0 && (
                  <div className="text-center">
                    <Icon name="FiAward" className="mx-auto mb-1 text-primary-600" />
                    <div className="text-sm font-medium">Certificaciones</div>
                    <div className="text-xs text-secondary-600 dark:text-secondary-400">
                      {certifications.join(', ')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <Card className="mb-8">
            <div className="border-b border-secondary-200 dark:border-secondary-700">
              <nav className="flex space-x-8">
                {['description', 'specifications', 'features', 'applications'].map((tab) => (
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
                    {tab === 'description' && 'Descripción'}
                    {tab === 'specifications' && 'Especificaciones'}
                    {tab === 'features' && 'Características'}
                    {tab === 'applications' && 'Aplicaciones'}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'description' && (
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-secondary-600 dark:text-secondary-300 leading-relaxed">
                    {description}
                  </p>
                </div>
              )}

              {activeTab === 'specifications' && specifications && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-secondary-100 dark:border-secondary-700">
                      <span className="font-medium text-secondary-700 dark:text-secondary-300 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="text-secondary-600 dark:text-secondary-400">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'features' && features && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Icon name="FiCheck" className="text-green-600" size="sm" />
                      <span className="text-secondary-700 dark:text-secondary-300">{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'applications' && applications && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {applications.map((application, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Icon name="FiTarget" className="text-blue-600" size="sm" />
                      <span className="text-secondary-700 dark:text-secondary-300">{application}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Accessories */}
          {accessories && accessories.length > 0 && (
            <div className="mb-8">
              <Heading level={2} className="mb-6">
                Accesorios Disponibles
              </Heading>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {accessories.map((accessory) => (
                  <Card key={accessory.id} className="p-4">
                    <div className="aspect-square bg-secondary-100 dark:bg-secondary-700 rounded-lg mb-3">
                      <ImageWithFallback
                        src={accessory.image}
                        alt={accessory.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <h4 className="font-semibold text-secondary-900 dark:text-white mb-1 line-clamp-2">
                      {accessory.name}
                    </h4>
                    <p className="text-sm text-secondary-600 dark:text-secondary-300 mb-3 line-clamp-2">
                      {accessory.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary-600 dark:text-primary-400">
                        ${accessory.price.toFixed(2)}
                      </span>
                      <Button size="sm" variant="outline">
                        <Icon name="FiPlus" size="sm" className="mr-1" />
                        Agregar
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Related Products */}
          {relatedProductsList.length > 0 && (
            <div>
              <Heading level={2} className="mb-6">
                Productos Relacionados
              </Heading>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {relatedProductsList.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    product={relatedProduct}
                    showActions={true}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default ProductDetail; 