'use strict'

const rAlphanumeric = /^[a-z0-9_$]+$/i

export const checkAlphanumeric = (str) => rAlphanumeric.test(str)
export const checkLength = (str) => str.length > 15
