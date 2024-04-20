from django.http import HttpResponse

def main(request):
	return HttpResponse('Django is working!')

def test(request):
	print(request.method)
	print("HELLO")
	return HttpResponse('Hello')