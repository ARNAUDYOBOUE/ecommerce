// src/api/client.js
import axios from 'axios';

const client = axios.create({
  baseURL: '/api', // Utilisation du proxy local
  withCredentials: true,
  timeout: 10000, // 10 secondes timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Intercepteur pour les requêtes
client.interceptors.request.use(
  config => {
    // Ajouter un timestamp pour éviter le cache
    config.params = { ...config.params, _t: Date.now() };
    console.log('Envoi de la requête à', config.url);
    return config;
  },
  error => {
    console.error('Erreur de requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
client.interceptors.response.use(
  response => {
    console.log('Réponse reçue:', response.status, response.config.url);
    return response;
  },
  error => {
    if (error.response) {
      // Le serveur a répondu avec un code d'état d'erreur
      console.error('Erreur API:', error.response.status, error.response.data);
      if (error.response.status === 404) {
        // Gérer spécifiquement les erreurs 404
        console.error('Ressource non trouvée:', error.config.url);
      }
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      console.error('Pas de réponse du serveur');
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      console.error('Erreur de configuration', error.message);
    }
    return Promise.reject(error);
  }
);

export default client;