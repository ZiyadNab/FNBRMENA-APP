// useEGSStore.ts
import { create } from 'zustand';
import axios from 'axios';
import qs from 'qs';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OAuthResponse {
    access_token: string;
    expires_in: number;
    expires_at: string;
    token_type: string;
    refresh_token: string;
    refresh_expires: number;
    refresh_expires_at: string;
    account_id: string;
    client_id: string;
    internal_client: boolean;
    client_service: string;
    displayName: string;
    app: string;
    in_app_id: string;
    product_id: string;
    application_id: string;
    acr: string;
    auth_time: string;
}

interface DeviceAuthResponse {
    deviceId: string;
    accountId: string;
    secret: string;
}

interface EGSStore {
    oauthToken: OAuthResponse | null;
    isEpicGamesAccountLinked: boolean;
    checkEpicGamesAccountLinked: () => Promise<DeviceAuthResponse | null>;
    linkEpicGamesServices: (EGSToken: string) => Promise<{ success: boolean; error?: string }>;
    unlinkEpicGamesServices: (EGSToken: string) => Promise<{ success: boolean; error?: string }>;
    generateOauthToken: () => Promise<{ success: boolean; error?: string }>;
    checkTokenStatus: (token: OAuthResponse) => void;
    getOauthToken: () => Promise<OAuthResponse | null>;
    initializeEpicGamesServiesAuthorzation: () => void;
}

const useEGSStore = create<EGSStore>((set) => ({
    oauthToken: null,
    isEpicGamesAccountLinked: false,

    checkEpicGamesAccountLinked: async () => {
        try {
            const deviceAuth = await AsyncStorage.getItem('deviceAuth');
            const parsedDeviceAuth: DeviceAuthResponse = JSON.parse(deviceAuth)
            return parsedDeviceAuth ? parsedDeviceAuth : null;
        } catch (error) {
            console.error('Error checking deviceAuth in AsyncStorage:', error);
            return null;
        }
    },

    getOauthToken: async () => {
        try {
            const oauthToken = await AsyncStorage.getItem('oauthToken');
            const parsedOauthToken: OAuthResponse = JSON.parse(oauthToken)
            return oauthToken ? parsedOauthToken : null;
        } catch (error) {
            console.error('Error checking oauthToken in AsyncStorage:', error);
            return null;
        }
    },

    linkEpicGamesServices: async (EGSToken: string) => {
        const oauthUrl = 'https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token';
        const deviceAuthUrl = `https://account-public-service-prod.ol.epicgames.com/account/api/public/account/`;

        const oauthData = {
            grant_type: 'authorization_code',
            code: EGSToken,
        };

        const oauthHeaders = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic MzQ0NmNkNzI2OTRjNGE0NDg1ZDgxYjc3YWRiYjIxNDE6OTIwOWQ0YTVlMjVhNDU3ZmI5YjA3NDg5ZDMxM2I0MWE='
        };

        try {
            // First POST request to get the OAuth token
            const oauthResponse = await axios.post<OAuthResponse>(oauthUrl, qs.stringify(oauthData), { headers: oauthHeaders });

            const { token_type, access_token, account_id } = oauthResponse.data;

            // Second POST request to get the device auth
            const deviceAuthHeaders = {
                'Authorization': `${token_type} ${access_token}`
            };

            const deviceAuthResponse = await axios.post<DeviceAuthResponse>(`${deviceAuthUrl}${account_id}/deviceAuth`, {}, { headers: deviceAuthHeaders });

            // Save the device auth response to AsyncStorage
            await AsyncStorage.setItem('deviceAuth', JSON.stringify(deviceAuthResponse.data));

            // Set isEpicGamesAccountLinked to true 
            set({ isEpicGamesAccountLinked: true })

            // Show success message
            return { success: true };

        } catch (error) {
            const errorMessage = error.response ? error.response.data : error.message;
            return { success: false, error: errorMessage };
        }
    },

    unlinkEpicGamesServices: async (EGSToken: string) => {
        const oauthKillUrl = 'https://account-public-service-prod.ol.epicgames.com/account/api/oauth/sessions/kill/';

        const oauthHeaders = {
            'Authorization': `bearer ${EGSToken}`
        };

        try {

            // First POST request to get the OAuth token
            const { status } = await axios.delete<OAuthResponse>(oauthKillUrl + EGSToken, { headers: oauthHeaders });
            if (status === 204) {

                await AsyncStorage.removeItem('oauthToken');
                set({
                    oauthToken: null,
                    isEpicGamesAccountLinked: false
                })
                return { success: true }
            }

        } catch (error) {
            const errorMessage = error.response ? error.response.data : error.message;
            return { success: false, error: errorMessage };
        }
    },

    generateOauthToken: async () => {

        try {
            const oauthUrl = 'https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token'

            const deviceAuth = await AsyncStorage.getItem('deviceAuth');
            const parsedDeviceAuth: DeviceAuthResponse = JSON.parse(deviceAuth);

            const oauthData = {
                grant_type: 'device_auth',
                account_id: parsedDeviceAuth.accountId,
                device_id: parsedDeviceAuth.deviceId,
                secret: parsedDeviceAuth.secret
            };

            const oauthHeaders = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic MzQ0NmNkNzI2OTRjNGE0NDg1ZDgxYjc3YWRiYjIxNDE6OTIwOWQ0YTVlMjVhNDU3ZmI5YjA3NDg5ZDMxM2I0MWE='
            };

            const oauthResponse = await axios.post<OAuthResponse>(oauthUrl, qs.stringify(oauthData), { headers: oauthHeaders })

            // Save the oauth token response to AsyncStorage
            await AsyncStorage.setItem('oauthToken', JSON.stringify(oauthResponse.data));

            set({ oauthToken: oauthResponse.data })
            return { success: true }
        } catch (error) {
            const errorMessage = error.response ? error.response.data : error.message;
            return { success: false, error: errorMessage };
        }

    },

    checkTokenStatus: async (token: OAuthResponse) => {

        const currentTime = new Date().getTime();
        const refreshTokenExpirationTime = new Date(token.refresh_expires_at).getTime();
        if (refreshTokenExpirationTime > currentTime) {

            const oauthUrl = 'https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token';

            const oauthData = {
                grant_type: 'refresh_token',
                refresh_token: token.refresh_token
            };

            const oauthHeaders = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic MzQ0NmNkNzI2OTRjNGE0NDg1ZDgxYjc3YWRiYjIxNDE6OTIwOWQ0YTVlMjVhNDU3ZmI5YjA3NDg5ZDMxM2I0MWE='
            };

            const oauthResponse = await axios.post<OAuthResponse>(oauthUrl, qs.stringify(oauthData), { headers: oauthHeaders })

            // Save the oauth token response to AsyncStorage
            await AsyncStorage.setItem('oauthToken', JSON.stringify(oauthResponse.data));
            set({ oauthToken: oauthResponse.data })

        } else useEGSStore.getState().generateOauthToken()
    },

    initializeEpicGamesServiesAuthorzation: async () => {
        const isLinked = await useEGSStore.getState().checkEpicGamesAccountLinked()
        if (isLinked) {

            // Set linked value
            set({ isEpicGamesAccountLinked: true })

            // Get the user token
            const token = await useEGSStore.getState().getOauthToken()

            // Check if the user has a token
            if (token) {

                // Check if the token is valid
                useEGSStore.getState().checkTokenStatus(token)
            } else {

                // Generate new token
                useEGSStore.getState().generateOauthToken()
                console.log("token generated")
            }
        }
    }

}));

export default useEGSStore;
