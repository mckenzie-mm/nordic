// Nextjs has both server side and client side rendering
// I prefer to keep env variables here rather
// than check every file for "use client" and add
// "NEXT_PUBLIC_*" in front of every variable which gets
// messy.

const HOST = process.env.HOST;

export const PORT = 5000;

export const APP_TEMPLATE = "CHARM"; 

export const API_ENDPOINT = `http://${HOST}:${PORT}`;

