from django.db import models

class Customer(models.Model):
    faam_id = models.IntegerField(primary_key=True)
    faam_name = models.CharField(max_length=100)
    faam_mobile = models.CharField(max_length=20)

    class Meta:
        db_table = 'customers'
        managed = False  # This tells Django not to manage the table structure
    def __str__(self):
        return self.faam_name
