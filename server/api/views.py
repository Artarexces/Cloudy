from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.serializers import AuthTokenSerializer
from django.contrib.auth.models import User
from django.conf import settings
from .models import History
from .serializers import historySerializer
import requests


# Vista del registro

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({'error': 'Usuario y contraseña son obligatorios.'}, status=400)
    if User.objects.filter(username=username).exists():
        return Response({'error':'Usuario ya existe.'}, status=400)
    User.objects.create_user(username=username, password=password)
    return Response({'msg': 'Registrado correctamente.'}, status=200)
    

# Vista del login 

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = AuthTokenSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})
    return Response({'error': 'Credenciales inválidas.'}, status=400)


# Vista de deslogeo

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    request.user.auth_token.delete()
    return Response({'msg': 'Sesión cerrada.'})



# Vista de climas 

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def weather(request):
    city = request.query_params.get('city')
    if not city: 
        return Response({'error': 'Ciudad no especificada'}, status=400)
    api_key = settings.WEATHERAPI_KEY
    url = f"http://api.weatherapi.com/v1/forecast.json?key={api_key}&q={city}&days=7&aqi=no&alerts=no"
    res = requests.get(url)
    if res.status_code != 200:
        return Response({'error': 'Error obteniendo clima.'}, status=res.status_code)
    data = res.json()

    History.objects.create(user=request.user, city=city)
    return Response({
        'current': data.get('current', {}),
        'forecast': data.get('forecast', {}).get('forecastday', []),
        'location': data.get('location', {}),
    })

    

# Vista de historial

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def history(request):
    qs = History.objects.filter(user=request.user).order_by('-timestamp')[:10]
    serializer = historySerializer(qs, many=True)
    return Response(serializer.data)