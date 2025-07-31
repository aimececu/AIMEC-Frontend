import React, { useState } from "react";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSave,
  FiX,
  FiSearch,
} from "react-icons/fi";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Card from "../../components/ui/Card";
import clsx from "clsx";

const Admin = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Controlador PLC Siemens S7-1200",
      description: "Controlador lógico programable de alta precisión",
      price: 1299.99,
      category: "controllers",
      brand: "siemens",
      stock: 15,
      image: "https://via.placeholder.com/300x300?text=PLC",
    },
    {
      id: 2,
      name: "Sensor de Temperatura RTD PT100",
      description: "Sensor de resistencia térmica de alta precisión",
      price: 89.99,
      category: "sensors",
      brand: "omron",
      stock: 45,
      image: "https://via.placeholder.com/300x300?text=RTD",
    },
  ]);

  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { value: "electronics", label: "Electrónicos" },
    { value: "mechanical", label: "Mecánicos" },
    { value: "automation", label: "Automatización" },
    { value: "sensors", label: "Sensores" },
    { value: "controllers", label: "Controladores" },
    { value: "actuators", label: "Actuadores" },
  ];

  const brands = [
    { value: "siemens", label: "Siemens" },
    { value: "allen-bradley", label: "Allen-Bradley" },
    { value: "schneider", label: "Schneider Electric" },
    { value: "omron", label: "Omron" },
    { value: "mitsubishi", label: "Mitsubishi" },
  ];

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
    image: "",
  });

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price) {
      const product = {
        id: Date.now(),
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock) || 0,
      };
      setProducts([...products, product]);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        brand: "",
        stock: "",
        image: "",
      });
      setIsAddingProduct(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct({ ...product });
  };

  const handleSaveEdit = () => {
    if (editingProduct) {
      setProducts(
        products.map((p) => (p.id === editingProduct.id ? editingProduct : p))
      );
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = (productId) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este producto?")
    ) {
      setProducts(products.filter((p) => p.id !== productId));
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-2">
            Panel de Administración
          </h1>
          <p className="text-secondary-600 dark:text-secondary-300">
            Gestiona los productos del catálogo
          </p>
        </div>

        {/* Search and Add Button */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
            />
          </div>
          <Button
            onClick={() => setIsAddingProduct(true)}
            icon={<FiPlus />}
            className="whitespace-nowrap"
          >
            Agregar Producto
          </Button>
        </div>

        {/* Add Product Form */}
        {isAddingProduct && (
          <Card className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                Agregar Nuevo Producto
              </h3>
              <Button
                variant="ghost"
                icon={<FiX />}
                iconOnly
                onClick={() => setIsAddingProduct(false)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre del Producto"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                placeholder="Ingrese el nombre del producto"
              />
              <Input
                label="Precio"
                type="number"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                placeholder="0.00"
              />
              <Select
                label="Categoría"
                options={categories}
                value={newProduct.category}
                onChange={(value) =>
                  setNewProduct({ ...newProduct, category: value })
                }
                placeholder="Seleccionar categoría"
              />
              <Select
                label="Marca"
                options={brands}
                value={newProduct.brand}
                onChange={(value) =>
                  setNewProduct({ ...newProduct, brand: value })
                }
                placeholder="Seleccionar marca"
              />
              <Input
                label="Stock"
                type="number"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, stock: e.target.value })
                }
                placeholder="0"
              />
              <Input
                label="URL de Imagen"
                value={newProduct.image}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, image: e.target.value })
                }
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              <div className="md:col-span-2">
                <Input
                  label="Descripción"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  placeholder="Descripción detallada del producto"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleAddProduct} icon={<FiSave />}>
                Guardar Producto
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsAddingProduct(false)}
              >
                Cancelar
              </Button>
            </div>
          </Card>
        )}

        {/* Products Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-200 dark:border-secondary-700">
                  <th className="text-left py-3 px-4 font-semibold text-secondary-900 dark:text-white">
                    Producto
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-secondary-900 dark:text-white">
                    Categoría
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-secondary-900 dark:text-white">
                    Precio
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-secondary-900 dark:text-white">
                    Stock
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-secondary-900 dark:text-white">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-secondary-100 dark:border-secondary-800"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover bg-secondary-100 dark:bg-secondary-700"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/48x48?text=Producto";
                          }}
                        />
                        <div>
                          <div className="font-medium text-secondary-900 dark:text-white">
                            {product.name}
                          </div>
                          <div className="text-sm text-secondary-500 dark:text-secondary-400">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                        {categories.find((c) => c.value === product.category)
                          ?.label || product.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-secondary-900 dark:text-white">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={clsx(
                          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                          product.stock > 10
                            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                            : product.stock > 0
                            ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                            : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                        )}
                      >
                        {product.stock} unidades
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<FiEdit />}
                          iconOnly
                          onClick={() => handleEditProduct(product)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<FiTrash2 />}
                          iconOnly
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                  Editar Producto
                </h3>
                <Button
                  variant="ghost"
                  icon={<FiX />}
                  iconOnly
                  onClick={handleCancelEdit}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nombre del Producto"
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      name: e.target.value,
                    })
                  }
                />
                <Input
                  label="Precio"
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      price: parseFloat(e.target.value),
                    })
                  }
                />
                <Select
                  label="Categoría"
                  options={categories}
                  value={editingProduct.category}
                  onChange={(value) =>
                    setEditingProduct({ ...editingProduct, category: value })
                  }
                />
                <Select
                  label="Marca"
                  options={brands}
                  value={editingProduct.brand}
                  onChange={(value) =>
                    setEditingProduct({ ...editingProduct, brand: value })
                  }
                />
                <Input
                  label="Stock"
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      stock: parseInt(e.target.value),
                    })
                  }
                />
                <Input
                  label="URL de Imagen"
                  value={editingProduct.image}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      image: e.target.value,
                    })
                  }
                />
                <div className="md:col-span-2">
                  <Input
                    label="Descripción"
                    value={editingProduct.description}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleSaveEdit} icon={<FiSave />}>
                  Guardar Cambios
                </Button>
                <Button variant="secondary" onClick={handleCancelEdit}>
                  Cancelar
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
