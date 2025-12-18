from django.contrib import admin
from django.urls import path, include

# Importações necessárias para servir ficheiros estáticos e media
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('projetos/', include('projects.urls')),
]
