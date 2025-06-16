import client from '../api/client.tsx';

export const getProducts = async () => {
  try {
    const response = await client.get('/products');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProduct = async (id) => {
  try {
    const response = await client.get(`/products/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const formData = new FormData();
    
    // Ajouter les champs texte
    Object.entries(productData).forEach(([key, value]) => {
      console.log(`Processing key: ${key}, value: ${value}, type: ${typeof value}`);
      if (value !== null && value !== undefined && key !== 'image' && key !== 'additionalImages') {
        formData.append(key, value.toString());
      } else if (value === null || value === undefined) {
        console.warn(`Skipping null/undefined value for key: ${key}`);
      }
    });

    // Ajouter l'image principale si elle existe
    if (productData.image) {
      formData.append('image', productData.image);
    } else {
      console.warn('No image found in productData');
    }

    // Ajouter les images supplémentaires si elles existent
    if (productData.additionalImages && Array.isArray(productData.additionalImages)) {
      productData.additionalImages.forEach((image) => {
        if (image) {
          formData.append('additionalImages', image);
        }
      });
    }

    const response = await client.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const formData = new FormData();
    
    // Ajouter les champs texte
    Object.entries(productData).forEach(([key, value]) => {
      if (value !== undefined && key !== 'image' && key !== 'additionalImages') {
        formData.append(key, value.toString());
      }
    });

    // Ajouter l'image principale si elle existe
    if (productData.image) {
      formData.append('image', productData.image);
    }

    // Ajouter les images supplémentaires si elles existent
    if (productData.additionalImages) {
      productData.additionalImages.forEach((image) => {
        formData.append('additionalImages', image);
      });
    }

    const response = await client.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    await client.delete(`/products/${id}`);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}; 