// JavaScript module
export const processQbgj = async (params) => {{
    try {{
        const response = await fetch('/api/data/enc2DR', {{
            method: 'POST',
            headers: {{
                'Content-Type': 'application/json'
            }},
            body: JSON.stringify(params)
        }});
        return await response.json();
    }} catch (error) {{
        console.error('Error:', error);
        throw error;
    }}
}};
