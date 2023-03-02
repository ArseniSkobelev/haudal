// @ts-nocheck
import { error } from "@sveltejs/kit"
import { BASE_URL } from '$env/static/private'

export const POST = async ({ request }) => {
    const body = await request.json();

    const response = await fetch(`${BASE_URL}/session/create`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })

    const responseData = await response.json();

    let isAuthorized = responseData.is_authorized

    if (isAuthorized != undefined) {
        if (isAuthorized) {
            return new Response(JSON.stringify({
                status: responseData.status,
                message: responseData.message,
                isAuthorized: responseData.is_authorized,
                token: responseData.token
            }))
        }
    }
}