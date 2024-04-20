from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

import csv
from io import StringIO

class Parser:
	def __init__(self, csvString):
		self.csvString = str(csvString)[2:-1].replace('\\r\\n', '\n')
		# print(self.csvString)

	def parse(self):
		with StringIO(self.csvString, newline='') as inCSV:
			csv_reader = csv.reader(inCSV, delimiter=';')
			for row in csv_reader:
				print(row)


def main(request):
	return HttpResponse('Django is working!')

@csrf_exempt
def test(request):
	p = Parser(request.FILES['file'].read())
	p.parse()

	response = HttpResponse('Hello, World!')
	response['Access-Control-Allow-Origin'] = 'http://localhost:4200'
	return response