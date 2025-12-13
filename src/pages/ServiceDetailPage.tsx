import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { conciergeServices } from '../data/conciergeServices';
import { serviceRequestService } from '../services/serviceRequestServiceSupabase';
import { ArrowLeft, Mail, Phone, User, MessageSquare, MapPin, Loader2, Settings } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const service = conciergeServices.find(s => s.slug === slug);

  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    address: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Service non trouvé</h1>
          <button
            onClick={() => navigate('/services')}
            className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Retour aux services
          </button>
        </div>
      </div>
    );
  }

  // Récupérer l'icône dynamiquement
  const IconComponent = (LucideIcons as any)[service.icon];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Effacer l'erreur du champ lors de la saisie
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validation Nom
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }

    // Validation Prénom
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }

    // Validation Email
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    // Validation Téléphone
    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    } else if (!/^[0-9\s+\-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Réinitialiser les erreurs
    setSubmitError(null);
    
    // Valider le formulaire
    if (!validateForm()) {
      return;
    }

    // Démarrer le chargement
    setIsSubmitting(true);

    try {
      // Soumettre la demande via le service
      const response = await serviceRequestService.createServiceRequest({
        serviceId: service.id,
        serviceName: service.name,
        serviceSlug: service.slug,
        lastName: formData.lastName,
        firstName: formData.firstName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        message: formData.message
      });

      if (response.success) {
        // Succès - afficher le message de confirmation
        setIsSubmitted(true);
        
        // Log supplémentaire pour debug
        console.log('✅ Demande enregistrée avec succès:', response.data);
        
        // Réinitialiser le formulaire après 5 secondes
        setTimeout(() => {
          setFormData({ lastName: '', firstName: '', email: '', phone: '', address: '', message: '' });
          setErrors({});
          setIsSubmitted(false);
        }, 5000);
      } else {
        // Erreur - afficher le message d'erreur
        setSubmitError(response.error || 'Une erreur est survenue');
        console.error('❌ Erreur lors de la soumission:', response.error);
      }
    } catch (error) {
      // Erreur inattendue
      console.error('❌ Erreur inattendue:', error);
      setSubmitError('Une erreur inattendue est survenue. Veuillez réessayer.');
    } finally {
      // Arrêter le chargement
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-orange-50">
      {/* Bouton Admin discret */}
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={() => navigate('/admin/conciergerie')}
          className="bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-200"
          title="Administration"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Header avec bouton retour */}
      <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 shadow-md border-b border-white/20">
        <div className="container mx-auto px-6 py-6">
          <button
            onClick={() => navigate('/services')}
            className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors duration-300 mb-4"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Retour aux services</span>
          </button>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mt-4 border border-purple-200">
            <p className="text-center text-gray-700">
              <span className="font-semibold text-purple-700">💡 En commandant ce service</span>, vous soutenez les jeunes de l'Église ADD Poissy dans leur projet <strong className="text-purple-700">Echo 2026</strong> ! 🎉
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* En-tête du service */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 mb-8">
            <div className="flex items-start gap-6">
              {/* Icône */}
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl p-6 shadow-lg flex-shrink-0">
                {IconComponent && <IconComponent size={48} />}
              </div>

              {/* Titre et description courte */}
              <div className="flex-grow">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  {service.name}
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {service.shortDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Description détaillée */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Description détaillée
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              {service.fullDescription}
            </p>
          </div>

          {/* Section "Manifester mon intérêt" */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Manifester mon intérêt
            </h2>
            <p className="text-gray-600 mb-6">
              Remplissez ce formulaire et nous vous recontacterons dans les plus brefs délais.
            </p>

            {isSubmitted ? (
              <div className="bg-gradient-to-br from-green-50 to-purple-50 border-2 border-green-500 rounded-xl p-8 text-center shadow-lg">
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Demande envoyée avec succès ! 🎉
                </h3>
                <p className="text-gray-700 text-lg mb-4">
                  Merci pour votre intérêt pour notre service <span className="font-semibold text-purple-600">{service.name}</span>.
                </p>
                <p className="text-gray-600 mb-4">
                  Nous avons bien reçu votre demande et notre équipe vous contactera dans les plus brefs délais pour discuter de vos besoins.
                </p>
                <div className="bg-purple-100 rounded-lg p-4 mb-4">
                  <p className="text-purple-800 font-semibold">
                    🙏 Merci de soutenir les jeunes dans leur projet Echo 2026 !
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t border-green-200">
                  <p className="text-sm text-gray-500">
                    Vous recevrez une confirmation par email à l'adresse indiquée.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Nom */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="text-gray-400" size={20} />
                    </div>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 transition-all duration-300 outline-none ${
                        errors.lastName 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-200 focus:border-teal-500 focus:ring-teal-200'
                      }`}
                      placeholder="Dupont"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>

                {/* Prénom */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="text-gray-400" size={20} />
                    </div>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 transition-all duration-300 outline-none ${
                        errors.firstName 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-200 focus:border-teal-500 focus:ring-teal-200'
                      }`}
                      placeholder="Jean"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="text-gray-400" size={20} />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 transition-all duration-300 outline-none ${
                        errors.email 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-200 focus:border-teal-500 focus:ring-teal-200'
                      }`}
                      placeholder="jean.dupont@exemple.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Téléphone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Téléphone *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="text-gray-400" size={20} />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 transition-all duration-300 outline-none ${
                        errors.phone 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-200 focus:border-teal-500 focus:ring-teal-200'
                      }`}
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                {/* Adresse (optionnel) */}
                <div>
                  <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                    Adresse <span className="text-gray-500 font-normal">(optionnel)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MapPin className="text-gray-400" size={20} />
                    </div>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 outline-none"
                      placeholder="123 rue de la Paix, 75001 Paris"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Message <span className="text-gray-500 font-normal">(optionnel)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-4 pointer-events-none">
                      <MessageSquare className="text-gray-400" size={20} />
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 outline-none resize-none"
                      placeholder="Décrivez vos besoins spécifiques..."
                    />
                  </div>
                </div>

                {/* Message d'erreur global */}
                {submitError && (
                  <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <p className="text-red-800 font-semibold">Erreur</p>
                      <p className="text-red-700 text-sm">{submitError}</p>
                    </div>
                  </div>
                )}

                {/* Bouton de soumission */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 flex items-center justify-center gap-2 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <span>Envoyer ma demande</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
