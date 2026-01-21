import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Custom base query that includes authentication token
const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: "/api",
  prepareHeaders: (headers) => {
    if (typeof window !== 'undefined') {
      // Check if we're on an admin route
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      
      // Get the appropriate token
      const token = isAdminRoute 
        ? localStorage.getItem('adminToken') 
        : localStorage.getItem('token');
      
      // If we have a token, add it to the headers
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      // Add user role header for authorization
      if (isAdminRoute) {
        const adminUser = localStorage.getItem('adminUser');
        if (adminUser) {
          try {
            const user = JSON.parse(adminUser);
            headers.set('X-User-Role', user.role || 'admin');
          } catch (e) {
            headers.set('X-User-Role', 'admin');
          }
        }
      } else {
        const user = localStorage.getItem('user');
        if (user) {
          try {
            const userData = JSON.parse(user);
            headers.set('X-User-Role', userData.role || 'user');
          } catch (e) {
            headers.set('X-User-Role', 'user');
          }
        }
      }
    }
    
    return headers;
  },
});

// Wrapper to handle 401 responses
const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await baseQueryWithAuth(args, api, extraOptions);
  
  // If we get a 401 Unauthorized response, clear auth and redirect to login
  if (result.error && result.error.status === 401) {
    if (typeof window !== 'undefined') {
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      
      if (isAdminRoute) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/admin/login';
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
  }
  
  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Artwork", "Service", "Testimonial", "Contact", "Settings", "Profile", "Analytics"],
  endpoints: (builder) => ({
    // Artwork endpoints
    getArtworks: builder.query({
      query: (params = {}) => {
        const url = new URL('/artworks', 'http://localhost');
        if (params.search) url.searchParams.append('search', params.search);
        if (params.category) url.searchParams.append('category', params.category);
        if (params.dateFrom) url.searchParams.append('dateFrom', params.dateFrom);
        if (params.dateTo) url.searchParams.append('dateTo', params.dateTo);
        if (params.limit) url.searchParams.append('limit', params.limit);
        return {
          url: url.pathname + url.search,
          method: 'GET'
        };
      },
      providesTags: ["Artwork"],
      transformResponse: (response) => response.data || response,
    }),
    getArtworkById: builder.query({
      query: (id) => `/artworks/${id}`,
      providesTags: (result, error, id) => [{ type: "Artwork", id }],
      transformResponse: (response) => response.data || response,
    }),
    addArtwork: builder.mutation({
      query: (artwork) => ({
        url: "/artworks",
        method: "POST",
        body: artwork,
      }),
      invalidatesTags: ["Artwork"],
      transformResponse: (response) => response.data || response,
    }),
    updateArtwork: builder.mutation({
      query: ({ id, ...artwork }) => ({
        url: `/artworks/${id}`,
        method: "PUT",
        body: artwork,
      }),
      invalidatesTags: ["Artwork"],
      transformResponse: (response) => response.data || response,
    }),
    deleteArtwork: builder.mutation({
      query: (id) => ({
        url: `/artworks?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Artwork"],
      transformResponse: (response) => response.data || response,
    }),
    
    // Service endpoints
    getServices: builder.query({
      query: (params = {}) => {
        const url = new URL('/services', 'http://localhost');
        if (params.search) url.searchParams.append('search', params.search);
        if (params.limit) url.searchParams.append('limit', params.limit);
        return {
          url: url.pathname + url.search,
          method: 'GET'
        };
      },
      providesTags: ["Service"],
      transformResponse: (response) => response.data || response,
    }),
    getServiceById: builder.query({
      query: (id) => `/services?id=${id}`,
      providesTags: (result, error, id) => [{ type: "Service", id }],
      transformResponse: (response) => response.data || response,
    }),
    addService: builder.mutation({
      query: (service) => ({
        url: "/services",
        method: "POST",
        body: service,
      }),
      invalidatesTags: ["Service"],
      transformResponse: (response) => response.data || response,
    }),
    updateService: builder.mutation({
      query: ({ id, ...service }) => ({
        url: `/services?id=${id}`,
        method: "PUT",
        body: service,
      }),
      invalidatesTags: ["Service"],
      transformResponse: (response) => response.data || response,
    }),
    deleteService: builder.mutation({
      query: (id) => ({
        url: `/services?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Service"],
      transformResponse: (response) => response.data || response,
    }),
    
    // Testimonial endpoints
    getTestimonials: builder.query({
      query: (params = {}) => {
        const url = new URL('/testimonials', 'http://localhost');
        if (params.search) url.searchParams.append('search', params.search);
        if (params.limit) url.searchParams.append('limit', params.limit);
        return {
          url: url.pathname + url.search,
          method: 'GET'
        };
      },
      providesTags: ["Testimonial"],
      transformResponse: (response) => response.data || response,
    }),
    getTestimonialById: builder.query({
      query: (id) => `/testimonials?id=${id}`,
      providesTags: (result, error, id) => [{ type: "Testimonial", id }],
      transformResponse: (response) => response.data || response,
    }),
    addTestimonial: builder.mutation({
      query: (testimonial) => ({
        url: "/testimonials",
        method: "POST",
        body: testimonial,
      }),
      invalidatesTags: ["Testimonial"],
      transformResponse: (response) => response.data || response,
    }),
    updateTestimonial: builder.mutation({
      query: ({ id, ...testimonial }) => ({
        url: `/testimonials?id=${id}`,
        method: "PUT",
        body: testimonial,
      }),
      invalidatesTags: ["Testimonial"],
      transformResponse: (response) => response.data || response,
    }),
    deleteTestimonial: builder.mutation({
      query: (id) => ({
        url: `/testimonials?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Testimonial"],
      transformResponse: (response) => response.data || response,
    }),
    
    // Contact Request endpoints
    getContactRequests: builder.query({
      query: (params = {}) => {
        const url = new URL('/contacts', 'http://localhost');
        if (params.search) url.searchParams.append('search', params.search);
        if (params.status) url.searchParams.append('status', params.status);
        if (params.dateFrom) url.searchParams.append('dateFrom', params.dateFrom);
        if (params.dateTo) url.searchParams.append('dateTo', params.dateTo);
        return {
          url: url.pathname + url.search,
          method: 'GET'
        };
      },
      providesTags: ["Contact"],
    }),
    getContactRequestById: builder.query({
      query: (id) => `/contacts/${id}`,
      providesTags: (result, error, id) => [{ type: "Contact", id }],
    }),
    addContactRequest: builder.mutation({
      query: (contact) => ({
        url: "/contacts",
        method: "POST",
        body: contact,
      }),
      invalidatesTags: ["Contact"],
    }),
    updateContactRequest: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/contacts/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: ["Contact"],
    }),
    deleteContactRequest: builder.mutation({
      query: (id) => ({
        url: `/contacts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Contact"],
    }),
    
    // Settings endpoints
    getSettings: builder.query({
      query: () => "/settings",
      providesTags: ["Settings"],
    }),
    updateSettings: builder.mutation({
      query: (settings) => ({
        url: "/settings",
        method: "PUT",
        body: settings,
      }),
      invalidatesTags: ["Settings"],
    }),
    
    // Artist Profile endpoints
    getArtistProfile: builder.query({
      query: () => "/profile",
      providesTags: ["Profile"],
      transformResponse: (response) => response.data || response,
    }),
    updateArtistProfile: builder.mutation({
      query: (profile) => ({
        url: "/profile",
        method: "PUT",
        body: profile,
      }),
      invalidatesTags: ["Profile"],
      transformResponse: (response) => response.data || response,
    }),
    
    // Analytics endpoints
    getAnalytics: builder.query({
      query: (params = {}) => {
        const url = new URL('/analytics', 'http://localhost');
        if (params.dateFrom) url.searchParams.append('dateFrom', params.dateFrom);
        if (params.dateTo) url.searchParams.append('dateTo', params.dateTo);
        return {
          url: url.pathname + url.search,
          method: 'GET'
        };
      },
      providesTags: ["Analytics"],
    }),
    getVisitorStats: builder.query({
      query: (params = {}) => {
        const url = new URL('/analytics/visitors', 'http://localhost');
        if (params.dateFrom) url.searchParams.append('dateFrom', params.dateFrom);
        if (params.dateTo) url.searchParams.append('dateTo', params.dateTo);
        return {
          url: url.pathname + url.search,
          method: 'GET'
        };
      },
      providesTags: ["Analytics"],
    }),
    
    // Auth endpoints
    adminLogin: builder.mutation({
      query: (credentials) => ({
        url: "/auth/admin/login",
        method: "POST",
        body: credentials,
      }),
    }),
    adminLogout: builder.mutation({
      query: () => ({
        url: "/auth/admin/logout",
        method: "POST",
      }),
    }),
    changePassword: builder.mutation({
      query: (passwords) => ({
        url: "/auth/change-password",
        method: "POST",
        body: passwords,
      }),
    }),
    verifyAdminToken: builder.query({
      query: () => "/auth/verify",
    }),
    
    // Image Upload endpoints
    uploadImage: builder.mutation({
      query: ({ file, type = 'artwork' }) => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('type', type);
        return {
          url: "/upload",
          method: "POST",
          body: formData,
        };
      },
    }),
    deleteImage: builder.mutation({
      query: (imageUrl) => ({
        url: "/upload",
        method: "DELETE",
        body: { imageUrl },
      }),
    }),
  }),
});

export const {
  useGetArtworksQuery,
  useGetArtworkByIdQuery,
  useAddArtworkMutation,
  useUpdateArtworkMutation,
  useDeleteArtworkMutation,
  useGetServicesQuery,
  useGetServiceByIdQuery,
  useAddServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useGetTestimonialsQuery,
  useGetTestimonialByIdQuery,
  useAddTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
  useGetContactRequestsQuery,
  useGetContactRequestByIdQuery,
  useAddContactRequestMutation,
  useUpdateContactRequestMutation,
  useDeleteContactRequestMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useGetArtistProfileQuery,
  useUpdateArtistProfileMutation,
  useGetAnalyticsQuery,
  useGetVisitorStatsQuery,
  useAdminLoginMutation,
  useAdminLogoutMutation,
  useChangePasswordMutation,
  useVerifyAdminTokenQuery,
  useUploadImageMutation,
  useDeleteImageMutation,
} = api;
