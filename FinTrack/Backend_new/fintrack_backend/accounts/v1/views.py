from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import CustomRegistrationSerializer, UserSerializer, AdminChangePasswordSerializer
from ..models import User


class RegisterUserView(generics.GenericAPIView):
    """
    POST: Register a new user + return JWT
    """
    serializer_class = CustomRegistrationSerializer
    permission_classes = [AllowAny]
    queryset = User.objects.all()

    def post(self, request):
        serializer = self.get_serializer(data=request.data)  # uses serializer_class
        if serializer.is_valid():
            user = serializer.save()

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "User created successfully",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    GET: Retrieve the authenticated user's profile
    PUT/PATCH: Update the authenticated user's profile
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class AdminUserListView(generics.ListAPIView):
    """
    GET: List all users (Admin only)
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]




class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Retrieve specific user details
    PUT/PATCH: Update specific user
    DELETE: Delete specific user
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]


class AdminChangePasswordView(generics.UpdateAPIView):
    """
    PUT: Change password of a specific user (Admin only)
    """
    queryset = User.objects.all()
    serializer_class = AdminChangePasswordSerializer # Need to import this
    permission_classes = [IsAdminUser]

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
