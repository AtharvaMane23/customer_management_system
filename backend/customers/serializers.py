from rest_framework import serializers
from .models import Customer

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['faam_id', 'faam_name', 'faam_mobile']
        
    def create(self, validated_data):
        print("Serializer create method called with data:", validated_data)
        instance = Customer.objects.create(**validated_data)
        print("Customer created with ID:", instance.faam_id)
        return instance

    def update(self, instance, validated_data):
        print("Serializer update method called")
        print("Instance before update:", instance.faam_id, instance.faam_name, instance.faam_mobile)
        print("Update data:", validated_data)
        
        instance.faam_name = validated_data.get('faam_name', instance.faam_name)
        instance.faam_mobile = validated_data.get('faam_mobile', instance.faam_mobile)
        instance.save()
        
        print("Instance after update:", instance.faam_id, instance.faam_name, instance.faam_mobile)
        return instance