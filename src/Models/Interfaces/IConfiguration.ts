/* 
    Shared interface with contains project configurations
*/

export interface IConfiguration
{
    // Debug or Release and etc
    label: string;

    // x64 or x86(Win32) and etc
    platform: string
};