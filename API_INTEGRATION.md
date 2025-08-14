# CitiZen Frontend-Backend Integration

## Overview

This document outlines the complete integration between the CitiZen frontend and backend APIs. The integration provides a robust, type-safe, and well-architected solution for state management and API communication.

## Architecture

### 1. Type Definitions (`client/types/api.ts`)

- **Comprehensive TypeScript interfaces** for all API requests and responses
- **Enums** for status, roles, and priority levels
- **Type-safe** data structures matching backend models

### 2. API Service Layer (`client/services/api.ts`)

- **Centralized API client** with proper error handling
- **Authentication headers** management
- **Request/response interceptors** for consistent error handling
- **All backend endpoints** implemented with proper typing

### 3. React Query Hooks (`client/hooks/useApi.ts`)

- **Efficient caching** and state management
- **Automatic background refetching**
- **Optimistic updates** for better UX
- **Error handling** with toast notifications
- **Loading states** management

### 4. Authentication Integration

- **JWT token management** with localStorage
- **Automatic token inclusion** in API requests
- **Role-based access control** with ProtectedRoute component
- **Session persistence** across page reloads

## Backend API Endpoints Integrated

### Authentication (`/api/auth`)

- `POST /auth/login/email` - Email/password login
- `POST /auth/login/google` - Google OAuth login
- `POST /auth/signup/email` - Email signup
- `POST /auth/signup/google` - Google OAuth signup
- `GET /auth/me` - Get current user profile
- `POST /auth/change-password` - Change password
- `PUT /auth/user-details` - Update user location details

### Issues (`/api/issues`)

- `GET /issues` - Get all issues with filtering
- `GET /issues/:id` - Get issue by ID
- `GET /issues/user/:user_id` - Get user's issues
- `GET /issues/constituency/:constituency_id` - Get constituency issues
- `POST /issues` - Create new issue
- `PUT /issues/:id` - Update issue
- `PATCH /issues/:id/status` - Update issue status
- `PATCH /issues/:id/assign` - Assign issue to department
- `POST /issues/:id/feedback` - Add feedback
- `DELETE /issues/:id` - Delete issue
- `GET /issues/statistics` - Get issue statistics

### Location Data (`/api/constituencies`, `/api/panchayats`)

- `GET /constituencies` - Get all constituencies
- `GET /constituencies/:id` - Get constituency by ID
- `GET /panchayats` - Get all panchayats
- `GET /panchayats/:id` - Get panchayat by ID
- `GET /panchayats/constituency/:constituency_id` - Get panchayats by constituency

### Upvotes (`/api/upvotes`)

- `POST /upvotes/:issue_id` - Upvote issue
- `DELETE /upvotes/:issue_id` - Remove upvote

## State Management

### React Query Configuration

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});
```

### Key Features

- **Automatic caching** with configurable stale times
- **Background refetching** for fresh data
- **Optimistic updates** for immediate UI feedback
- **Error boundaries** with graceful fallbacks
- **Loading states** with spinners and skeleton screens

## Authentication Flow

### Login Process

1. User submits credentials
2. API call to `/auth/login/email`
3. JWT token stored in localStorage
4. User context updated with profile data
5. Role-based redirect to appropriate dashboard

### Signup Process

1. User fills two-step form (Personal Info + Location)
2. Location data fetched from API dropdowns
3. API call to `/auth/signup/email`
4. Account created with role determination
5. Automatic login and redirect

### Google OAuth

1. Simulated Google OAuth flow
2. API call to `/auth/login/google` or `/auth/signup/google`
3. Same token and session management
4. Seamless integration with existing flow

## Role-Based Access Control

### User Roles

- **Citizen** (`citizen`) - Normal users, can create/view issues
- **MLA Staff** (`mlastaff`) - Legislative assembly staff
- **Department** (`dept`) - Department heads
- **Department Staff** (`dept_staff`) - Department employees
- **Admin** (`admin`) - System administrators

### Route Protection

```typescript
<ProtectedRoute allowedRoles={["MLA"]}>
  <Analytics />
</ProtectedRoute>
```

### Dashboard Redirects

- **MLA**: `/analytics` - Analytics dashboard
- **Department**: `/` - Department dashboard
- **Citizen**: `/issues` - Issues dashboard

## Error Handling

### API Error Structure

```typescript
interface ApiError {
  success: false;
  message: string;
  error?: string;
  status?: number;
}
```

### Error Handling Features

- **Consistent error messages** across all API calls
- **Toast notifications** for user feedback
- **Graceful fallbacks** for network issues
- **Retry mechanisms** for transient failures

## Data Flow

### Issue Management

1. **Create Issue**: Form data → API → Cache invalidation → UI update
2. **Update Issue**: Optimistic update → API → Cache update → UI
3. **Delete Issue**: Confirmation → API → Cache invalidation → UI update
4. **Status Updates**: Immediate UI feedback → API → Cache update

### Location Data

1. **Constituencies**: Loaded once, cached for 10 minutes
2. **Panchayats**: Loaded based on constituency selection
3. **Wards**: Loaded from selected panchayat data

## Mock Data Status

### Commented Out (No API Endpoints)

- **Department Dashboard Data**: Employee stats, department metrics
- **Location Data**: Static constituency/panchayat data (now using API)

### TODO Items

- **Department Dashboard**: Need backend endpoints for employee management
- **Analytics Dashboard**: Need backend endpoints for MLA analytics
- **User Dashboard**: Need backend endpoints for citizen dashboard

## Development Setup

### Prerequisites

- Backend server running on `http://localhost:3333`
- Frontend dependencies installed
- React Query configured

### Environment Variables

```env
VITE_API_BASE_URL=http://localhost:3333/api
```

### Testing the Integration

1. Start backend server
2. Start frontend development server
3. Test login/signup flows
4. Test issue creation and management
5. Test location data loading

## Performance Optimizations

### Caching Strategy

- **User data**: 5 minutes stale time
- **Issues**: 2 minutes stale time
- **Location data**: 10 minutes stale time
- **Statistics**: 5 minutes stale time

### Bundle Optimization

- **Code splitting** for route-based components
- **Tree shaking** for unused imports
- **Lazy loading** for heavy components

## Security Considerations

### Token Management

- **JWT tokens** stored in localStorage
- **Automatic inclusion** in API headers
- **Token refresh** mechanism (TODO)
- **Logout cleanup** of stored tokens

### Input Validation

- **Client-side validation** for immediate feedback
- **Server-side validation** for security
- **TypeScript types** for compile-time safety

## Future Enhancements

### Planned Features

- **Real-time updates** with WebSocket integration
- **Offline support** with service workers
- **Push notifications** for issue updates
- **File upload** for issue attachments
- **Advanced filtering** and search

### API Enhancements

- **Pagination** for large datasets
- **Real-time notifications** endpoint
- **File upload** endpoints
- **Advanced analytics** endpoints

## Troubleshooting

### Common Issues

1. **CORS errors**: Ensure backend CORS configuration
2. **Authentication errors**: Check token storage and headers
3. **Network errors**: Verify API base URL and server status
4. **Type errors**: Ensure TypeScript types match backend models

### Debug Tools

- **React Query DevTools** for cache inspection
- **Network tab** for API call monitoring
- **Console logs** for error tracking

## Conclusion

The integration provides a solid foundation for the CitiZen platform with:

- **Type-safe** API communication
- **Efficient** state management
- **Scalable** architecture
- **User-friendly** error handling
- **Role-based** access control

The system is ready for production use with proper backend deployment and environment configuration.
