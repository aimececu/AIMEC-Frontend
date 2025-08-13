import { useState, useEffect } from 'react';
import { productFeatureEndpoints } from '../api/endpoints/productFeatures';
import { productApplicationEndpoints } from '../api/endpoints/productApplications';

export const useProductDetails = (productId) => {
  const [features, setFeatures] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar características y aplicaciones cuando cambie el productId
  useEffect(() => {
    if (productId) {
      loadProductDetails();
    } else {
      setFeatures([]);
      setApplications([]);
    }
  }, [productId]);

  const loadProductDetails = async () => {
    if (!productId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const [featuresResponse, applicationsResponse] = await Promise.all([
        productFeatureEndpoints.getFeaturesByProduct(productId),
        productApplicationEndpoints.getApplicationsByProduct(productId)
      ]);

      if (featuresResponse.success) {
        setFeatures(featuresResponse.data);
      }
      
      if (applicationsResponse.success) {
        setApplications(applicationsResponse.data);
      }
    } catch (err) {
      setError('Error al cargar los detalles del producto');
      console.error('Error loading product details:', err);
    } finally {
      setLoading(false);
    }
  };

  const addFeature = async (featureData) => {
    try {
      const response = await productFeatureEndpoints.createFeature({
        ...featureData,
        product_id: productId
      });
      
      if (response.success) {
        setFeatures(prev => [...prev, response.data]);
        return { success: true, data: response.data };
      }
      return { success: false, error: response.error };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateFeature = async (featureId, featureData) => {
    try {
      const response = await productFeatureEndpoints.updateFeature(featureId, featureData);
      
      if (response.success) {
        setFeatures(prev => prev.map(f => f.id === featureId ? response.data : f));
        return { success: true, data: response.data };
      }
      return { success: false, error: response.error };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteFeature = async (featureId) => {
    try {
      const response = await productFeatureEndpoints.deleteFeature(featureId);
      
      if (response.success) {
        setFeatures(prev => prev.filter(f => f.id !== featureId));
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const addApplication = async (applicationData) => {
    try {
      const response = await productApplicationEndpoints.createApplication({
        ...applicationData,
        product_id: productId
      });
      
      if (response.success) {
        setApplications(prev => [...prev, response.data]);
        return { success: true, data: response.data };
      }
      return { success: false, error: response.error };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateApplication = async (applicationId, applicationData) => {
    try {
      const response = await productApplicationEndpoints.updateApplication(applicationId, applicationData);
      
      if (response.success) {
        setApplications(prev => prev.map(a => a.id === applicationId ? response.data : a));
        return { success: true, data: response.data };
      }
      return { success: false, error: response.error };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteApplication = async (applicationId) => {
    try {
      const response = await productApplicationEndpoints.deleteApplication(applicationId);
      
      if (response.success) {
        setApplications(prev => prev.filter(a => a.id !== applicationId));
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const refreshData = () => {
    if (productId) {
      loadProductDetails();
    }
  };

  return {
    // Estado
    features,
    applications,
    loading,
    error,
    
    // Acciones
    addFeature,
    updateFeature,
    deleteFeature,
    addApplication,
    updateApplication,
    deleteApplication,
    refreshData,
    
    // Utilidades
    hasFeatures: features.length > 0,
    hasApplications: applications.length > 0,
    totalFeatures: features.length,
    totalApplications: applications.length
  };
};
