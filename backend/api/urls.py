from django.urls import path
from views import register, login_view, logout_view, weather, history

path('register/', register)
path('login/', login_view)
path('logout/', logout_view)
path('weather/', weather)
path('history/', history)