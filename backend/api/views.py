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
    api_key = settings.OWM_API_KEY
    geo = requests.get(
        f'https://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid={api_key}'
    )
    if geo.status_code != 200 or not geo.json():
        return Response({'error', 'Ciudad no encontrada.'}, status=404)
    lat, lon = geo.json()[0]['lat'], geo.json()[0]['lon']
    weather_res = requests.get(
        f'https://api.openweathermap.org/data/2.5/onecall'
        f'?lat={lat}&lon={lon}&exclude=minutely,hourly,alerts'
        f'&units=metric&appid={api_key}'
    )
    if weather_res.status_code != 200:
        return Response({'error': 'Error obteniendo el clima.'}, status=500)
    data = weather_res.json()
    History.objects.create(user=request.user, city=city)
    return Response({
        'current': data.get('current', {}),
        'daily': data.get('daily', [])
    })
    
    

# Vista de historial

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def history(request):
    qs = History.objects.filter(user=request.user).order_by('-timestamp')[:10]
    serializer = historySerializer(qs, many=True)
    return Response(serializer.data)