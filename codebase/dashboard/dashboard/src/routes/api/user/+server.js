// @ts-nocheck
import { error } from "@sveltejs/kit"
import { BASE_URL } from '$env/static/private'

export const POST = async ({ request }) => {
    const body = await request.json();

    const response = await fetch(`${BASE_URL}/user`, {
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
                status: 200,
                message: "User created successfully. You are currently being redirected to the homepage",
                token: responseData.token
            }))
        } else {
            return new Response(JSON.stringify({
                responseData
            }))
        }
    }
}