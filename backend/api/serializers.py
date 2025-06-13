from rest_framework import serializers
from .models import History


class historySerializer(serializers.ModelSerializer):
    class Meta:
        model = History
        fields = ['city', 'timestamp']