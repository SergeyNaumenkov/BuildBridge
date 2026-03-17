#include <stdlib.h>
#include <time.h>

/* 
	Get random number from this .dll
*/
int GetRandomInt()
{
	/* 
		Initialize Pseudo Random
	*/
	srand(time(0));

	/* 
		Get Random int variable number
	*/
	int random = rand();

	/* 
		return it
	*/
	return random;
}

/* 
	Declare this function as exported from dll
	So that GetProcAddress can find it in the VirtualTable
*/
extern "C"
{
	__declspec(dllexport) int GetRandomIntExport()
	{
		return GetRandomInt();
	}
}