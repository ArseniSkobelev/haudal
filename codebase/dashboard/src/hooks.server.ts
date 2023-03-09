import { SECRET_BASE_URL } from "$env/static/private";
import { parse } from 'cookie'

import type { Handle } from "@sveltejs/kit";
import type { User } from "./app";

export const handle: Handle = async ({ event, resolve }) => {
    const cookies = parse(event.request.headers.get("cookie") || "");

    if (cookies.Authorization) {
        try {
            const apiResponse = await fetch(`${SECRET_BASE_URL}/user`, {
                method: "GET",
                headers: {
                    "Authorization": cookies.Authorization
                }
            })

            const apiResponseJson = await apiResponse.json()

            if (apiResponseJson.status == 200) {
                let user: User = {
                    email: apiResponseJson.email
                }

                event.locals.user = user
            }
        } catch (error) {
            console.log(error);
        }
    }

    return await resolve(event);
}