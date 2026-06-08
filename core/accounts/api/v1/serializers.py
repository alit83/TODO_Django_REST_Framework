from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth.password_validation import validate_password
from accounts.models import User
from django.core import exceptions
from rest_framework import status
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class SignUpApiserializer(serializers.ModelSerializer):
    password1 = serializers.CharField(max_length=255, write_only=True)

    class Meta:
        model = User
        fields = ["email", "password", "password1"]

    def validate(self, attrs):
        if attrs.get("password") != attrs.get("password1"):
            raise serializers.ValidationError(
                {"details": "password confirm does not match"}
            )
        try:
            validate_password(attrs.get("password"))
        except exceptions.ValidationError as e:
            raise serializers.ValidationError({"password": list(e.message)})
        return super().validate(attrs)

    def create(self, validated_data):
        validated_data.pop("password1", None)
        return User.objects.create_user(**validated_data)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        validated_date = super().validate(attrs)
        validated_date["email"] = self.user.email
        validated_date['is_verify'] = self.user.is_verified
        return validated_date


class ForgertPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=100, write_only=True)


class VerifyEmailResendSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=100)

class PasswordResetSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=255, write_only=True)
    password1 = serializers.CharField(max_length=255, write_only=True)

    def validate(self, attrs):
        if attrs.get("password") != attrs.get("password1"):
            raise serializers.ValidationError(
                {"details": "password confirm does not match"}
            )
        try:
            validate_password(attrs.get("password"))
        except exceptions.ValidationError as e:
            raise serializers.ValidationError({"password": list(e.message)})
        return super().validate(attrs)
