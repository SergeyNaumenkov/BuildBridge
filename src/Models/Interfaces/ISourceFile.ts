/* 
    Shared interface for source files included in project
*/

export interface ISourceFile
{
    // Path to source file
    path: string;

    // Type (.cpp,.cxx, .h .hpp)
    type: string;
};