import csv
from io import BytesIO

class Paser:
	def __init__(self, csvString):
		self.csvString = csvString

	def parse():
		with BytesIO(self.csvString) as inCSV:
			csv_reader = csv.reader(inCSV, delimiter=';')
			for row in csv_reader:
				print(row)