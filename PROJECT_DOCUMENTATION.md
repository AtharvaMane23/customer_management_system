# Customer Management System Documentation

## Project Overview
A full-stack web application for managing customer information, built with React.js frontend and Django backend, using Oracle database for data storage.

## Technical Stack

### Frontend Technologies
- **React.js**: v19.2.0
- **Bootstrap**: v5.3.8
- **Axios**: v1.12.2
- **React Router DOM**: v7.9.4
- **Node.js**: Required for development
- Other dependencies:
  - @fortawesome/fontawesome-free: v7.1.0
  - @testing-library/react: v16.3.0
  - react-scripts: v5.0.1

### Backend Technologies
- **Python**: v3.8+
- **Django**: v3.2
- **Django REST Framework**: Latest version
- **django-cors-headers**: Latest version
- **cx_Oracle**: Latest version for Oracle database connectivity

### Database
- **Oracle Database**: 12.2
- **Connection Details**:
  - Host: 10.200.10.160
  - Port: 1521
  - Service Name: YOUR_SERVICE_NAME
  - Schema: YOUR_SCHEMA

## Network Configuration

### Development Environment
- **Backend Server**: 
  - URL: http://10.200.10.160:8000
  - Listening on all interfaces (0.0.0.0:8000)
- **Frontend Server**: 
  - URL: http://10.200.10.160:3000
  - Development server (npm start)

### CORS Configuration
Configured in Django settings to allow cross-origin requests from:
- http://10.200.10.160:3000
- http://localhost:3000

## Application Flows

### 1. Basic Data Flow (List Customers)

#### Files Involved
1. `frontend/src/config.js` - API base URL configuration
2. `frontend/src/components/CustomerList.js` - Frontend component
3. `backend/customer_management/urls.py` - URL routing
4. `backend/customers/views.py` - Request handling
5. `backend/customers/serializers.py` - Data serialization
6. `backend/customers/models.py` - Database interaction

#### Component Responsibilities
- **Frontend (React)** - User interface and data presentation
- **URLs (Django)** - Request routing
- **ViewSet (Django REST)** - HTTP method handling
- **Serializer (Django REST)** - Data formatting
- **Model (Django)** - Database operations
- **Database (Oracle)** - Data storage and retrieval

#### Flow Steps
1. Frontend makes GET request to `http://10.200.10.160:8000/api/customers/`
2. Django routes the request to CustomerViewSet
3. ViewSet uses the serializer to format the data
4. Serializer gets data from the model
5. Model retrieves data from Oracle database
6. Data flows back through the same path
7. Frontend receives JSON data and displays it

### 2. Edit Customer Flow

#### Initial Navigation Flow
1. **Click Event** (`CustomerList.js`)
   ```javascript
   <Link to={`/edit/${customer.faam_id}`}>Edit</Link>
   ```
   - Triggers React Router navigation
   - Customer ID passed in URL

2. **Route Configuration** (`App.js`)
   ```javascript
   <Route path="/edit/:id" element={<EditCustomer />} />
   ```
   - Matches URL pattern
   - Renders EditCustomer component

3. **Component Mount** (`EditCustomer.js`)
   ```javascript
   const { id } = useParams();  // Extracts ID from URL
   ```
   - Gets customer ID from URL parameters
   - Initializes form state

#### Data Flow for Edit Operation

1. **Initial Data Fetch**
   ```javascript
   const fetchCustomer = async () => {
     const response = await axios.get(`${config.API_BASE_URL}/api/customers/${id}/`);
     setName(response.data.faam_name);
     setMobile(response.data.faam_mobile);
   };
   ```
   - Fetches current customer data
   - Populates form fields

2. **Update Submission**
   ```javascript
   const handleSubmit = async (e) => {
     await axios.put(`${config.API_BASE_URL}/api/customers/${id}/`, {
       faam_name: name,
       faam_mobile: mobile
     });
     navigate('/');
   };
   ```
   - Sends PUT request with updated data
   - Redirects to list page on success

3. **Backend Processing** (`views.py`)
   ```python
   def update(self, request, *args, **kwargs):
       instance = self.get_object()
       serializer = self.get_serializer(instance, data=request.data)
       serializer.save()
       return Response(serializer.data)
   ```
   - Validates update data
   - Saves to database
   - Returns updated record

#### HTTP Flow Example
1. **Initial GET Request**:
   ```http
   GET /api/customers/123/
   Response: {
     "faam_id": 123,
     "faam_name": "Original Name",
     "faam_mobile": "1234567890"
   }
   ```

2. **Update PUT Request**:
   ```http
   PUT /api/customers/123/
   Body: {
     "faam_name": "Updated Name",
     "faam_mobile": "9876543210"
   }
   ```

## Project Structure

### Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── CustomerList.js    # Main customer listing component
│   │   ├── AddCustomer.js     # Customer creation form
│   │   └── EditCustomer.js    # Customer editing form
│   ├── config.js              # API configuration
│   └── App.js                 # Main application component
├── public/
└── package.json
```

### Backend Structure
```
backend/
├── customer_management/        # Main project directory
│   ├── settings.py            # Project settings
│   ├── urls.py               # Main URL routing
│   └── wsgi.py              # WSGI configuration
├── customers/                # Customers app
│   ├── models.py            # Database models
│   ├── views.py             # API views
│   ├── serializers.py       # Data serializers
│   └── urls.py              # App URL routing
└── manage.py
```

## Database Integration

### Models
The Customer model in `customers/models.py`:
```python
from django.db import models

class Customer(models.Model):
    faam_id = models.AutoField(primary_key=True)
    faam_name = models.CharField(max_length=100)
    faam_mobile = models.CharField(max_length=20)
    
    class Meta:
        db_table = 'customers'
```

### PL/SQL Integration

#### 1. Model-Level Integration
Add custom methods to the Customer model to call PL/SQL procedures:

```python
from django.db import connection

class Customer(models.Model):
    # ... existing model fields ...

    @classmethod
    def execute_custom_procedure(cls, param1, param2):
        with connection.cursor() as cursor:
            # Example of calling a PL/SQL procedure
            cursor.callproc('CUSTOMER_PKG.YOUR_PROCEDURE', [param1, param2])
            # For procedures that return results
            results = cursor.fetchall()
            return results
            
    @classmethod
    def get_customer_stats(cls):
        with connection.cursor() as cursor:
            # Example of calling a function
            result = cursor.callfunc('CUSTOMER_PKG.GET_STATS', int)
            return result
```

#### 2. View-Level Integration
In `customers/views.py`:
```python
from rest_framework.decorators import action
from rest_framework.response import Response

class CustomerViewSet(viewsets.ModelViewSet):
    # ... existing viewset code ...

    @action(detail=False, methods=['post'])
    def process_customer(self, request):
        try:
            result = Customer.execute_custom_procedure(
                request.data.get('param1'),
                request.data.get('param2')
            )
            return Response({'status': 'success', 'data': result})
        except Exception as e:
            return Response({'status': 'error', 'message': str(e)})
```

#### 3. Frontend Integration
In your React components:
```javascript
const callCustomProcedure = async () => {
    try {
        const response = await axios.post(
            `${config.API_BASE_URL}/api/customers/process_customer/`,
            {
                param1: value1,
                param2: value2
            }
        );
        // Handle the response
        if (response.data.status === 'success') {
            // Process successful result
        }
    } catch (error) {
        console.error('Error calling procedure:', error);
    }
};
```

## Security Considerations

1. **Database Security**
   - Use connection pooling in production
   - Implement proper user roles and permissions in Oracle
   - Keep sensitive credentials in environment variables

2. **API Security**
   - CORS restrictions in place
   - CSRF protection enabled
   - Input validation on both frontend and backend

3. **Network Security**
   - Configure firewall rules for ports 3000 and 8000
   - Use HTTPS in production
   - Implement proper authentication/authorization

## Deployment Checklist

1. **Backend Deployment**
   - Set DEBUG = False in production
   - Configure proper ALLOWED_HOSTS
   - Set up proper database connection pooling
   - Configure proper static file serving

2. **Frontend Deployment**
   - Build production bundle (npm run build)
   - Configure proper API_BASE_URL
   - Set up proper web server (nginx/apache)

3. **Database**
   - Set up proper backup procedures
   - Configure proper user permissions
   - Optimize for production use

## Adding New Features

1. **Database Level**
   - Create new PL/SQL procedures in Oracle
   - Add proper exception handling
   - Document all procedures and functions

2. **Backend Level**
   - Add new models if needed
   - Create new API endpoints
   - Implement proper validation

3. **Frontend Level**
   - Create new React components
   - Update routing configuration
   - Implement proper error handling

## Maintenance

1. **Regular Updates**
   - Keep dependencies updated
   - Monitor security advisories
   - Update documentation as needed

2. **Monitoring**
   - Monitor API performance
   - Track database performance
   - Monitor server resources

3. **Backup**
   - Regular database backups
   - Code repository backups
   - Configuration backups