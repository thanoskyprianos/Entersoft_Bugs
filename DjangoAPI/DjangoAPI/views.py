import boto3
from botocore.exceptions import ClientError
from django.http import HttpResponse, HttpResponseBadRequest, HttpRequest
from django.views.decorators.csrf import csrf_exempt
import wave

import os
import csv
from io import StringIO

# Ai speech 
import speech_recognition as sr 
from pydub import AudioSegment
from pydub.silence import split_on_silence

import boto3
from botocore.exceptions import ClientError


# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

"""
Purpose

Shows how to use the AWS SDK for Python (Boto3) with the Agents for Amazon
Bedrock Runtime client to send prompts to an agent to process and respond to.
"""

import logging

from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)


# snippet-start:[python.example_code.bedrock-agent-runtime.BedrockAgentsRuntimeWrapper.class]
# snippet-start:[python.example_code.bedrock-agent-runtime.BedrockAgentRuntimeWrapper.decl]
class BedrockAgentRuntimeWrapper:
    """Encapsulates Agents for Amazon Bedrock Runtime actions."""

    def __init__(self, runtime_client):
        """
        :param runtime_client: A low-level client representing the Agents for Amazon
                               Bedrock Runtime. Describes the API operations for running
                               inferences using Bedrock Agents.
        """
        self.agents_runtime_client = runtime_client

    # snippet-end:[python.example_code.bedrock-agent-runtime.BedrockAgentRuntimeWrapper.decl]

    # snippet-start:[python.example_code.bedrock-agent-runtime.InvokeAgent]
    def invoke_agent(self, agent_id, agent_alias_id, session_id, prompt):
        """
        Sends a prompt for the agent to process and respond to.

        :param agent_id: The unique identifier of the agent to use.
        :param agent_alias_id: The alias of the agent to use.
        :param session_id: The unique identifier of the session. Use the same value across requests
                           to continue the same conversation.
        :param prompt: The prompt that you want Claude to complete.
        :return: Inference response from the model.
        """

        try:
            response = self.agents_runtime_client.invoke_agent(
                agentId=agent_id,
                agentAliasId=agent_alias_id,
                sessionId=session_id,
                inputText=prompt,
            )

            completion = ""

            for event in response.get("completion"):
                chunk = event["chunk"]
                completion = completion + chunk["bytes"].decode()

        except ClientError as e:
            logger.error(f"Couldn't invoke agent. {e}")
            raise

        return completion

    # snippet-end:[python.example_code.bedrock-agent-runtime.InvokeAgent]


# snippet-end:[python.example_code.bedrock-agent-runtime.BedrockAgentsRuntimeWrapper.class]


class Parser:
	def __init__(self, csvString):
		self.csvString = str(csvString)[2:-1].replace('\\r\\n', '\n')
		# print(self.csvString)

	def parse(self):
		with StringIO(self.csvString, newline='') as inCSV:
			csv_reader = csv.reader(inCSV, delimiter=';')
			for row in csv_reader:
				print(row)

class AiSpeech:
	def __init__(self):
		self.r = sr.Recognizer()
	
	def audioTranscribe(self, path) -> str:
		r = sr.Recognizer()
		with sr.AudioFile(path) as source:
			audio = r.record(source)

		try:
			transcription = r.recognize_google(audio)
			print('Google thinks you said: ', transcription)
		except Exception as e: # dont do this in production
			print(e)
			transcription = ''

		return transcription

class AiText:
	def main (self, prompt='Hello') :
		runtime_client = boto3.client(
			service_name="bedrock-agent-runtime", region_name="us-west-2"
		)
		
		wrapper = BedrockAgentRuntimeWrapper(runtime_client)

		agent_id = "SNV7UL9TBM"
		agent_alias_id = "CEAYUDNJTE"
		session_id = "FAKE_SESSION_ID"

		expected_params = {
			"agentId": agent_id,
			"agentAliasId": agent_alias_id,
			"sessionId": session_id,
			"inputText": prompt,
		}
		response = {"completion": {}, "contentType": "", "sessionId": session_id}


		completion = wrapper.invoke_agent(agent_id, agent_alias_id, session_id, prompt)
		print(completion)

		return completion

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
	audio.setframerate(44100)

	blob = audio_data.read()
	audio.writeframes(blob)
	audio.close()

	r = AiSpeech()
	prompt = r.audioTranscribe('test.wav')
	response.content = prompt

	return response

@csrf_exempt
def text(request: HttpRequest):
	if (request.method != 'POST'):
		return HttpResponseBadRequest('Wrong request method')
	
	response = HttpResponse()
	response['Access-Control-Allow-Origin'] = 'http://localhost:4200'
	
	requestData = request.POST.get('prompt')
	print(requestData)

	r = AiText()
	prompt = r.main(requestData)

	response.content = prompt

	return response