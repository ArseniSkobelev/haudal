import type { RequestEvent, RequestHandler } from "./$types";
import { SECRET_BASE_URL } from "$env/static/private";

export const DELETE: RequestHandler = async ({ request, cookies }: RequestEvent) => {
    const requestData = await request.json();

    if (requestData.access_token) {
        let authHeader = cookies.get("Authorization");

        if (authHeader) {
            let apiResponse = await fetch(`${SECRET_BASE_URL}/token`, {
                method: "DELETE",
                headers: {
                    "Authorization": authHeader,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "access_token": requestData.access_token
                })
            })

            const apiResponseJson = await apiResponse.json();

            if (apiResponseJson.is_deleted == true) {
                return new Response(JSON.stringify({
                    "status": 200,
                    "is_deleted": true
                }))
            }

            return new Response(JSON.stringify({
                "status": 304,
                "is_deleted": false
            }))
        }
    } else {
        return new Response(JSON.stringify({
            "status": 304,
            "is_deleted": false
        }))
    }

    return new Response(JSON.stringify({
        "status": 304,
        "is_deleted": false
    }))
}

export const POST: RequestHandler = async ({ request, cookies }: RequestEvent) => {
    const requestData = await request.json();

    if (requestData.app_name) {
        let authHeader = cookies.get("Authorization");

        if (authHeader) {
            let apiResponse = await fetch(`${SECRET_BASE_URL}/token`, {
                method: "POST",
                headers: {
                    "Authorization": authHeader,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "app_name": requestData.app_name
                })
            })

            const apiResponseJson = await apiResponse.json();

            return new Response(JSON.stringify(apiResponseJson));
        }
    }

    return new Response(JSON.stringify({
        "status": 500,
    }))
}