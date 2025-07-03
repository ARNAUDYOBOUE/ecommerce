import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../services/productService';
import axios from 'axios';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  image: File;
}

const AddProduct: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: ProductFormData) => {
    try {
      setLoading(true);
      
      if (!fileList[0]?.originFileObj) {
        message.error('Veuillez sélectionner une image');
        return;
      }

      const productData = {
        name: values.name.trim(),
        description: values.description.trim(),
        price: values.price,
        stock: values.stock,
        image: fileList[0].originFileObj,
      };

      console.log('Données du produit à envoyer:', {
        ...productData,
        image: productData.image.name
      });

      const response = await createProduct(productData);

      console.log('Réponse du serveur:', response);

      if (response) {
        message.success('Produit ajouté avec succès');
        navigate('/');
      }
    } catch (error) {
      console.error('Erreur complète:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Erreur de connexion au serveur';
        console.error('Détails de l\'erreur:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
        message.error(errorMessage);
      } else {
        message.error('Une erreur inattendue est survenue');
      }
    } finally {
      setLoading(false);
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Vous ne pouvez télécharger que des fichiers images!');
      return Upload.LIST_IGNORE;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('L\'image doit faire moins de 5MB!');
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const handleChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Ajouter un nouveau produit</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-4"
      >
        <Form.Item
          name="name"
          label="Nom du produit"
          rules={[
            { required: true, message: 'Veuillez entrer le nom du produit' },
            { min: 3, message: 'Le nom doit faire au moins 3 caractères' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            { required: true, message: 'Veuillez entrer la description' },
            { min: 10, message: 'La description doit faire au moins 10 caractères' }
          ]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="price"
          label="Prix"
          rules={[
            { required: true, message: 'Veuillez entrer le prix' },
            { type: 'number', min: 0, message: 'Le prix doit être positif' }
          ]}
        >
          <InputNumber
            min={0}
            step={0.01}
            className="w-full"
            formatter={(value) => `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => {
              if (!value) return 0;
              const parsed = value.replace(/€\s?|(,*)/g, '');
              return isNaN(Number(parsed)) ? 0 : Number(parsed);
            }}
          />
        </Form.Item>

        <Form.Item
          name="stock"
          label="Stock"
          rules={[
            { required: true, message: 'Veuillez entrer le stock' },
            { type: 'number', min: 0, message: 'Le stock doit être positif' }
          ]}
        >
          <InputNumber min={0} className="w-full" />
        </Form.Item>

        <Form.Item
          name="image"
          label="Image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: 'Veuillez télécharger une image' }]}
        >
          <Upload
            listType="picture"
            maxCount={1}
            beforeUpload={beforeUpload}
            fileList={fileList}
            onChange={handleChange}
          >
            <Button icon={<UploadOutlined />}>Télécharger l'image</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} className="w-full">
            Ajouter le produit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProduct;