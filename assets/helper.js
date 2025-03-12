// JavaScript module
export const processkHzT = async (params) => {{
    try {{
        const response = await fetch('/api/data/8uWiNR', {{
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
