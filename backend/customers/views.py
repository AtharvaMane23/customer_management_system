from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Customer
from .serializers import CustomerSerializer
from django.db import connection

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all().order_by('faam_id')
    serializer_class = CustomerSerializer

    def create(self, request, *args, **kwargs):
        try:
            print("Starting customer creation...")
            print("Original request data:", request.data)
            
            # Get max id from the database
            with connection.cursor() as cursor:
                cursor.execute("SELECT NVL(MAX(faam_id), 0) FROM customers")
                max_id = cursor.fetchone()[0]
                new_id = max_id + 1
                print(f"Retrieved max_id: {max_id}, new_id will be: {new_id}")

            # Add the new ID to the request data
            data = request.data.copy()
            data['faam_id'] = new_id
            print("Modified request data with new ID:", data)

            # Create serializer with modified data and explicitly save
            serializer = self.get_serializer(data=data)
            if serializer.is_valid():
                print("Serializer is valid, saving...")
                serializer.save()
                print("Save completed, returning response...")
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                print("Serializer validation errors:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print("Error occurred:", str(e))
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        try:
            print("Starting customer update...")
            print("Original request data:", request.data)
            instance = self.get_object()
            print(f"Found customer with ID: {instance.faam_id}")

            # Keep the original ID, only update name and mobile
            data = request.data.copy()
            data['faam_id'] = instance.faam_id
            print("Modified request data:", data)

            serializer = self.get_serializer(instance, data=data, partial=False)
            if serializer.is_valid():
                print("Serializer is valid, saving...")
                serializer.save()
                print("Update completed, returning response...")
                return Response(serializer.data)
            else:
                print("Serializer validation errors:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print("Error occurred during update:", str(e))
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
