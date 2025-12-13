export interface ServiceRequest {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceSlug: string;
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  address?: string;
  message?: string;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceRequestDTO {
  serviceId: string;
  serviceName: string;
  serviceSlug: string;
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  address?: string;
  message?: string;
}

export interface ServiceRequestResponse {
  success: boolean;
  data?: ServiceRequest;
  error?: string;
  message?: string;
}
