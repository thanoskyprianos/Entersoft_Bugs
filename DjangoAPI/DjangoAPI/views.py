from django.http import HttpResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
import wave

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


def main(_):
	return HttpResponse('Django is working!')

@csrf_exempt
def csv(request):
	if (request.method != 'POST'):
		return HttpResponseBadRequest('Wrong request method')
	
	response = HttpResponse()
	response['Access-Control-Allow-Origin'] = 'http://localhost:4200'


	csvSuccess = True # change it accordingly
	# Do csv processing... (check file names, do embedding etc...)

	if (csvSuccess):
		response.content = 'Successfully parsed/stored csv data'
		return response
	else:
		return HttpResponseBadRequest('Bad CSV Data')

@csrf_exempt
def audio(request):
	if (request.method != 'POST'):
		return HttpResponseBadRequest('Wrong request method')

	response = HttpResponse()
	response['Access-Control-Allow-Origin'] = 'http://localhost:4200'

	audio_data = request.FILES['blob']
	audio = wave.open('test.wav', 'wb')
	audio.setnchannels(1)
	audio.setsampwidth(2)
	audio.setframerate(50000)

	blob = audio_data.read()
	audio.writeframes(blob)
	audio.close()

	# do audio processing
	# get text prompt from AI (we'll pass it again to a text request)

	prompt = 'TestGeneration' # add the prompt here

	response.content = prompt

	return response

@csrf_exempt
def text(request):
	if (request.method != 'POST'):
		return HttpResponseBadRequest('Wrong request method')
	
	response = HttpResponse()
	response['Access-Control-Allow-Origin'] = 'http://localhost:4200'
	
	# do data processing
	# return the AI response
	AIResponse = 'TestContent' # put it here

	response.content = AIResponse

	return response