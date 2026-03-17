#include <iostream>
#include "TestLIB.h"

TestPrinter::TestPrinter()
{

}

TestPrinter::~TestPrinter()
{

}

/*
	Test function
	Just print message in console
	Using 'printf'
*/
void TestPrinter::PrintMessage(const char *message)
{
	if(!message)
	{
		printf("'message' is nullptr!");
		printf("\n");
		return;
	}

	printf(message);
	printf("\n");
}
