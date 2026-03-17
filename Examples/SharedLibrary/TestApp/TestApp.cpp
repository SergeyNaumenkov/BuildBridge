#include <cstdio>

/* 

	Add header file from TestLIB folder

*/
#include "TestLIB.h"

/* 

	A console application created through the BuildBridge Project Wizard.
	Press F5 to assemble the app and launch it.
	Press ctrl + shift + B to simply assemble the app.
	---------------------------------------------------------------------
	There are three buttons on the "Build Bridge -> Projects" panel.
	1 (left): Build the application (analogous to ctrl + shift + B).
	2: Launch the application with Debugger.
	3: Launch the application without Debugger.
	---------------------------------------------------------------------
	After creation:
	The project library will help you to view
	the project properties( go to the project and click on the wrench, c++ -> General -> add additional directories )

	This Example is include .lib file
*/


/* 
	Default ConsoleApplication entry point
*/
int main()
{
	// Special pass nullptr string into PrintMessage Function
	TestPrinter().PrintMessage(nullptr);
	
	// Print message
	TestPrinter().PrintMessage("Hello from ConsoleApplication created via BuildBridge Project Wizard!");
	return 0;
}