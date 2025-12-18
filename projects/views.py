import json
import os
from django.conf import settings
from django.shortcuts import render

def get_projects_from_json():
    """Função auxiliar para carregar o JSON"""
    
    json_path = os.path.join(settings.BASE_DIR, 'projects', 'data', 'projects.json')
    
    try:
        with open(json_path, 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        return [] 

def project_list(request):
    """View principal"""
    projects_data = get_projects_from_json()
    
    projects = projects_data.get('projetos',[])
    skills =  projects_data.get('stacks',[])
    services =  projects_data.get('services',[])
    contact = projects_data.get('contact',{})

    context = {
        'projects': projects,
        'stacks': skills,
        'servicos': services,
        'contato': contact
    }
    return render(request, 'projects.html', context)