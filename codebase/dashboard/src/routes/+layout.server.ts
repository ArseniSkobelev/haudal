
import type { LayoutServerLoad } from './$types';
import { SECRET_BASE_URL } from '$env/static/private';
import { redirect } from "@sveltejs/kit";
import UserApiKeyStore from '../lib/stores/UserApiKeyStore';

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
    let authToken = cookies.get("Authorization")

    if (authToken) {
        const response = await fetch(`${SECRET_BASE_URL}/token`, {
            method: "GET",
            headers: {
                "Authorization": authToken,
            }
        });

        const apiResponseJson = await response.json();

        console.log(apiResponseJson);

        if (apiResponseJson.status || apiResponseJson.status == 200) {
            if (apiResponseJson.api_keys != null) {
                if (apiResponseJson.api_keys.length != 0) {
                    UserApiKeyStore.set(apiResponseJson.api_keys)
                }
            }
        }
    } else {
        throw redirect(302, "/login");
    }
}