from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

def main(request):
	return HttpResponse('Django is working!')

@csrf_exempt
def test(request):
	print(request.body)

	response = HttpResponse('Hello, World!')
	response['Access-Control-Allow-Origin'] = 'http://localhost:4200'
	return response