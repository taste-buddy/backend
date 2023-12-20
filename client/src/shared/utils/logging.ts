/*
 * Copyright (c) 2023 Josef Müller.
 */

/**
 * Log a message to the console
 * @param functionName the name of the function
 * @param message the message to log
 */
export const log = (functionName: string, message?: any, ...messages: any[]) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`[${functionName}]:`, message, ...messages)
    }
}
/**
 * Debug a message to the console
 * @param functionName the name of the function
 * @param message the message to log
 * @param messages
 */
export const logDebug = (functionName: string, message?: any, ...messages: any[]) => {
    if (process.env.NODE_ENV === 'development') {
        console.debug(`[${functionName}]:`, message, ...messages)
    }
}

/**
 * Warn a message to the console
 * @param functionName the name of the function
 * @param message the message to log
 * @param messages
 */
export const logWarn = (functionName: string, message?: any, ...messages: any[]) => {
    if (process.env.NODE_ENV === 'development') {
        console.warn(`[${functionName}]:`, message, ...messages)
    }
}

/**
 * Log an error to the console
 * @param functionName the name of the function that threw the error
 * @param error the error to log
 * @param errors
 */
export const logError = (functionName: string, error: any, ...errors: any[]) => {
    if (error instanceof Error) {
        console.error(`[${functionName}]: ${error.message}`)
    } else {
        console.error(`[${functionName}]:`, error, ...errors)
    }
}