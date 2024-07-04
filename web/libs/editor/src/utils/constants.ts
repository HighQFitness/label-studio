const PROD_BASE_URL = 'https://mobile.highqfit.com/workout_svc/';
const DEV_BASE_URL = 'http://localhost:9898/'; // 'https://y6an25l59g.execute-api.us-east-1.amazonaws.com/dev/';//'http://localhost:5858/'; // 'https://y6an25l59g.execute-api.us-east-1.amazonaws.com/dev/';
export const BASE_URL_VIDEO = DEV_BASE_URL; //PROD_BASE_URL;
export const VIDEO_CUSTOM_ID_PREFIX = 'labeling-video';
/**
 * Fallback WORKOUT ID, used in sending requests, if data-manager fails to extract a valid ID.
 */
export const TEMP_WORKOUT_ID = 'undefined'; // 'b9632f23-5e01-40b2-9566-b558d38d4100';
export const CHART_TIME_SLAB = 10 * 1000; // 10 seconds converted to milliseconds
export const VERSION = '1.3.4'; // A variable to determine editor's version, when deployed.
export const FALLBACK_STORAGE_FILE_NAME  = ''