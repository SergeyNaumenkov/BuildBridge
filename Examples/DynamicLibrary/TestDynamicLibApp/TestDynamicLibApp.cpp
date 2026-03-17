#include <Windows.h>
#include <cstdio>

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
	It is not necessary to connect this library as a .lib. 
	In this example,
	we just upload it.

	Q: why do I use only the name without the path when uploading?
	A: because the project uses the standard output file settings, 
	   and this will put the file in the same folder as the .exe)
	---------------------------------------------------------------------
*/

/* 
	Default entry point for Console Application
*/
int main()
{
	/* 
		Welcome message :)
	*/
	printf("Hello from ConsoleApplication created via BuildBridge Project Wizard!\n");

	/* 
		Load DynamicLib.dll from 'x64/Debug/' folder
	*/
	printf("Loading DynamicLibrary.dll....\n");
	auto libHandle = LoadLibraryA("DynamicLibrary.dll");
	if(!libHandle)
	{
		printf("Failed load dynamic library!\n");
		return 1;
	}

	/* 
		Get address of exported function
	*/
	printf("Try load virtual proc address from DynamicLibrary.dll\n");
	auto proc = GetProcAddress(libHandle, "GetRandomIntExport");
	if(!proc)
	{
		printf("Failed load proc address from DynamicLibrary.dll!\n");
		return 1;
	}

	/* 
		Call function and get result
	*/
	auto randomNumber = proc();
	printf("Random number is: %i\n",randomNumber);

	/* 
		Unload DynamicLibrary.dll from memory
	*/
	FreeLibrary(libHandle);
	
	return 0;
}